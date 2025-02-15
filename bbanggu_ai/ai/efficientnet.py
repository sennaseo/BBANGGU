import os

import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from torchvision.models import EfficientNet_B2_Weights


def load_model(model_path, num_classes):
    model = models.efficientnet_b2(weights=EfficientNet_B2_Weights.DEFAULT)
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    return model


def classify(cropped_image_dir: str):
    model_path = './models/efficientnet_b2.pth'  # 학습된 모델 경로
    class_names = [
        'bagel', 'baguette', 'bun', 'cake', 'croissant', 'croquette',
        'financier', 'pizza', 'pretzel', 'red_bean', 'scone', 'soboro', 'tart', 'white_bread'
    ]
    model = load_model(model_path, num_classes=len(class_names))
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    bread_counts = {}
    for img_name in os.listdir(cropped_image_dir):
        img_path = os.path.join(cropped_image_dir, img_name)
        image = Image.open(img_path).convert('RGB')
        image = transform(image).unsqueeze(0)

        with torch.no_grad():
            output = model(image)
            predicted_class = torch.argmax(output, dim=1).item()
            predicted_bread = class_names[predicted_class]

            # Update count in dictionary
            if predicted_bread in bread_counts:
                bread_counts[predicted_bread] += 1
            else:
                bread_counts[predicted_bread] = 1

    # Return only bread types that were detected
    return {k: v for k, v in bread_counts.items() if v > 0}
