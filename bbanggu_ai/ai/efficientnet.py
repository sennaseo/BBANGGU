import os

import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image

from ai.classes import CLASS_NAMES

MODEL_PATH = os.getenv("EFFICIENTNET_MODEL_PATH", "./models/efficientnet_b7.pth")


def load_model(model_path, num_classes):
    # weights=None: 사전학습 가중치를 받아봤자 load_state_dict가 전부 덮어쓰므로
    # 다운로드(네트워크 의존 + 수백MB)를 건너뛰고 구조만 만든다
    model = models.efficientnet_b7(weights=None)
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
    # torch 2.6부터 torch.load의 weights_only 기본값이 True로 바뀜.
    # 우리가 직접 학습한 신뢰 가능한 가중치이므로 False로 명시 (안 하면 UnpicklingError)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu'), weights_only=False))
    model.eval()
    return model


# 앱 기동 시 1회만 로드 (기존에는 요청마다 245MB를 디스크에서 재로드했음)
_model = load_model(MODEL_PATH, num_classes=len(CLASS_NAMES))

_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])


def classify(cropped_image_dir: str, class_filter: list = None):
    # Validate class_filter
    if class_filter:
        for cls in class_filter:
            if cls not in CLASS_NAMES:
                raise ValueError(f"Class '{cls}' in class_filter is not in available class_names")

    bread_counts = {}

    for img_name in os.listdir(cropped_image_dir):
        img_path = os.path.join(cropped_image_dir, img_name)
        image = Image.open(img_path).convert('RGB')
        image = _transform(image).unsqueeze(0)

        with torch.no_grad():
            output = _model(image)
            probabilities = torch.softmax(output, dim=1)[0]  # Convert to probabilities

            if class_filter:
                # Get indices of filtered classes
                filter_indices = [CLASS_NAMES.index(cls) for cls in class_filter]

                # Get probabilities only for filtered classes
                filtered_probs = probabilities[filter_indices]

                # Get the index of highest probability among filtered classes
                max_filtered_idx = torch.argmax(filtered_probs).item()

                # Map back to original class name
                predicted_bread = class_filter[max_filtered_idx]
            else:
                # Original behavior when no filter is provided
                predicted_class = torch.argmax(probabilities).item()
                predicted_bread = CLASS_NAMES[predicted_class]

            # Update count in dictionary
            if predicted_bread in bread_counts:
                bread_counts[predicted_bread] += 1
            else:
                bread_counts[predicted_bread] = 1

    # Return only bread types that were detected
    return {k: v for k, v in bread_counts.items() if v > 0}
