package com.ssafy.bbanggu.auth.service;

<<<<<<< HEAD
=======
import org.apache.commons.lang3.tuple.Pair;
>>>>>>> origin/develop
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
<<<<<<< HEAD

=======
>>>>>>> origin/develop
	private final JavaMailSender mailSender;
	private final InMemoryStoreService storeService;

	public EmailService(JavaMailSender mailSender, InMemoryStoreService storeService) {
		this.mailSender = mailSender;
		this.storeService = storeService;
	}

	/**
	 * 이메일로 인증번호 전송
<<<<<<< HEAD
	 *
	 * @param email 이메일 주소
	 */
	public void sendAuthenticationCode(String email) {
		// 요청 제한 확인 (과도한 요청 방지)
=======
	 * @param email 이메일 주소
	 */
	public void sendAuthenticationCode(String email) {
		// 1. 요청 제한 확인 (과도한 요청 방지)
>>>>>>> origin/develop
		if (storeService.isRateLimited(email)) {
			throw new TooManyRequestsException("Too many requests. Please try again later.");
		}

<<<<<<< HEAD
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
=======
		// 2. 인증번호 생성
		String authCode = generateAuthCode();

		// 3. 이메일 전송
		sendEmail(email, authCode);

		// 4. 인증번호 저장
		storeAuthCode(email, authCode);
>>>>>>> origin/develop
	}

	/**
	 * 인증번호 생성
<<<<<<< HEAD
	 *
=======
>>>>>>> origin/develop
	 * @return 6자리 인증번호
	 */
	private String generateAuthCode() {
		Random random = new Random();
		int code = random.nextInt(900000) + 100000;
		return String.valueOf(code);
	}

	/**
<<<<<<< HEAD
=======
	 * 인증번호 저장
	 * : 인증번호는 10분 후 만료되며, 한 번 인증을 받으면 1시간동안 요청이 제한됨
	 *
	 * @param email 인증할 이메일
	 * @param authCode 인증번호
	 */
	private void storeAuthCode(String email, String authCode) {
		storeService.saveAuthCode(email, authCode, 10 * 60);
		storeService.setRateLimit(email);
	}

	/**
>>>>>>> origin/develop
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
<<<<<<< HEAD
                <img src='cid:%s' alt="BBANGGU Logo" style="width: 150px; margin-bottom: 20px;">
=======
                <img src='cid:%s' alt="BBANGGU Logo" style="width: 150px; margin-bottom: 20px; background-color: transparent;">
>>>>>>> origin/develop
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
<<<<<<< HEAD
                    style="display: inline-block; padding: 10px 20px; background-color: #d18b47; 
=======
                    style="display: inline-block; padding: 10px 20px; background-color: #d18b47;
>>>>>>> origin/develop
                    color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    인증하기
                </a>
                <p style="color: #777; margin-top: 20px;">
<<<<<<< HEAD
                    인증 코드는 10분 동안 유효합니다. <br> 
=======
                    인증 코드는 10분 동안 유효합니다. <br>
>>>>>>> origin/develop
                    문의 사항이 있으면 <a href="mailto:support@bbanggu.com">support@bbanggu.com</a>으로 연락해 주세요.
                </p>
            </div>
        """.formatted(logoCid, authCode, to, authCode);

			helper.setText(htmlContent, true);

			// BBANGGU 로고 첨부
<<<<<<< HEAD
			ClassPathResource logoResource = new ClassPathResource("static/images/BBANGGU_logo_가로버전.png");
=======
			ClassPathResource logoResource = new ClassPathResource("static/images/BBANGGU_logo.png");
>>>>>>> origin/develop
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
<<<<<<< HEAD
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
=======
	 * @param inputCode 사용자가 입력한 인증번호
	 */
	public void verifyAuthenticationCode(String email, String inputCode) {
		// 이미 사용된 인증번호인지 먼저 확인 (410 GONE)
		if (storeService.isAuthCodeUsed(email)) {
			throw new CodeExpiredException("This authentication code has already been used.");
		}

		// 저장된 인증번호 가져오기 (null이면 401 UNAUTHORIZED)
		Pair<String, Long> codeData = storeService.getAuthCodeData(email);
		if(codeData == null) {
			throw new InvalidCodeException("Invalid authentication code.");
		}

		// 인증번호가 일치하지 않는 경우 (401 UNAUTHORIZED)
		if(!codeData.getLeft().equals(inputCode)) {
			throw new InvalidCodeException("Invalid authentication code.");
		}

		// 만료된 인증번호인지 확인 (410 GONE)
		if(System.currentTimeMillis() > codeData.getRight()) {
			storeService.deleteAuthCode(email); // 만료된 코드 삭제
			throw new CodeExpiredException("Authentication code has expired.");
		}

		// 인증 성공한 경우, 인증번호를 사용 처리
		storeService.markAuthCodeAsUsed(email);
>>>>>>> origin/develop
	}
}
