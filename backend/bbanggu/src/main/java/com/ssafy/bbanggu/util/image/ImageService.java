package com.ssafy.bbanggu.util.image;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageService {

	private final Path uploadDir;

	public ImageService(@Value("${app.upload-dir:./uploads}") String uploadDir) {
		this.uploadDir = Paths.get(uploadDir);
	}

	public String saveImage(MultipartFile file) throws IOException {
		String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
		Path filePath = uploadDir.resolve(filename);

		Files.createDirectories(uploadDir);
		Files.write(filePath, file.getBytes());

		return "/uploads/" + filename;
	}

}
