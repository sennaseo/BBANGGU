package com.ssafy.bbanggu.util.image;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImageService {
	private final String uploadDir = "home/ubuntu/uploads/";

	public String saveImage(MultipartFile file) throws IOException {
		String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
		Path filePath = Paths.get(uploadDir + filename);
		Files.createDirectories(filePath.getParent());
		Files.write(filePath, file.getBytes());
		System.out.println("이미지 저장 성공");

		return "/uploads/" + filename;
	}

}
