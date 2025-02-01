package com.ssafy.bbanggu.auth.service;

import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Random;

import com.ssafy.bbanggu.common.exception.CodeExpiredException;
import com.ssafy.bbanggu.common.exception.InvalidCodeException;
import com.ssafy.bbanggu.common.exception.TooManyRequestsException;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

	private final JavaMailSender mailSender;
	private final InMemoryStoreService storeService;

	public EmailService(JavaMailSender mailSender, InMemoryStoreService storeService) {
		this.mailSender = mailSender;
		this.storeService = storeService;
	}

	/**
	 * 이메일로 인증번호 전송
	 *
	 * @param email 이메일 주소
	 */
	public void sendAuthenticationCode(String email) {
		// 요청 제한 확인 (과도한 요청 방지)
		if (storeService.isRateLimited(email)) {
			throw new TooManyRequestsException("Too many requests. Please try again later.");
		}

		// 인증번호 생성
		String authCode = generateAuthCode();

		// 이메일 전송
		sendEmail(email, authCode);

		// 인증번호 저장 (10분 후 만료)
		int CODE_EXPIRE_TIME = 10 * 60;
		storeService.saveAuthCode(email, authCode, CODE_EXPIRE_TIME);

		// 요청 제한 설정 (1시간 동안 요청 제한)
		int RATE_LIMIT_EXPIRE_TIME = 60 * 60;
		storeService.setRateLimit(email, RATE_LIMIT_EXPIRE_TIME);
	}

	/**
	 * 인증번호 생성
	 *
	 * @return 6자리 인증번호
	 */
	private String generateAuthCode() {
		Random random = new Random();
		int code = random.nextInt(900000) + 100000;
		return String.valueOf(code);
	}

	/**
	 * 이메일 전송
	 *
	 * @param to 수신자 이메일 주소
	 * @param authCode 인증번호
	 */
	private void sendEmail(String to, String authCode) {
		MimeMessage message = mailSender.createMimeMessage();
		try {
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
			helper.setTo(to);
			helper.setSubject("[BBANGGU] 이메일 인증 코드");

			// BBANGGU 로고 이미지 CID (이메일 본문에 포함)
			String logoCid = "bbangguLogo";

			// 이메일 HTML 본문
			String htmlContent = """
            <div style="background-color: #f9f5f0; padding: 20px; text-align: center; border-radius: 10px;">
                <img src='cid:%s' alt="BBANGGU Logo" style="width: 150px; margin-bottom: 20px;">
                <h2 style="color: #d18b47;">BBANGGU 이메일 인증</h2>
                <p style="font-size: 16px; color: #333;">
                    안녕하세요! BBANGGU 서비스를 이용해주셔서 감사합니다. <br>
                    아래의 인증 코드를 입력하여 이메일 인증을 완료하세요.
                </p>
                <div style="background: #fff; display: inline-block; padding: 15px 30px; font-size: 24px;
                    font-weight: bold; color: #d18b47; border-radius: 5px; margin: 20px 0;">
                    %s
                </div>
                <p>또는 아래 버튼을 눌러 인증을 완료하세요:</p>
                <a href="http://localhost:8080/auth/email/verify?email=%s&authCode=%s"
                    style="display: inline-block; padding: 10px 20px; background-color: #d18b47; 
                    color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    인증하기
                </a>
                <p style="color: #777; margin-top: 20px;">
                    인증 코드는 10분 동안 유효합니다. <br> 
                    문의 사항이 있으면 <a href="mailto:support@bbanggu.com">support@bbanggu.com</a>으로 연락해 주세요.
                </p>
            </div>
        """.formatted(logoCid, authCode, to, authCode);

			helper.setText(htmlContent, true);

			// BBANGGU 로고 첨부
			ClassPathResource logoResource = new ClassPathResource("static/images/BBANGGU_logo_가로버전.png");
			helper.addInline(logoCid, logoResource);

			mailSender.send(message);
		} catch (MessagingException e) {
			throw new RuntimeException("Failed to send email", e);
		}
	}

	/**
	 * 이메일 인증번호 검증
	 *
	 * @param email 이메일 주소
	 * @param authCode 사용자가 입력한 인증번호
	 */
	public void verifyAuthenticationCode(String email, String authCode) {
		// 저장된 인증번호 가져오기
		String storedCode = storeService.getAuthCode(email);
		if (storedCode == null) {
			throw new CodeExpiredException("Authentication code has expired.");
		}

		// 인증번호 검증
		if (!storedCode.equals(authCode)) {
			throw new InvalidCodeException("Authentication code is incorrect.");
		}

		// 인증 완료 후 인증번호 삭제
		storeService.deleteAuthCode(email);
	}
}
