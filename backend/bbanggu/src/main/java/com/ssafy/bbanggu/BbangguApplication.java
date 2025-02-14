package com.ssafy.bbanggu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BbangguApplication {
	public static void main(String[] args) {
		SpringApplication.run(BbangguApplication.class, args);
	}
}
