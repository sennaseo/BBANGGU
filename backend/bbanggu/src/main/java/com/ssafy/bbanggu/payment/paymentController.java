package com.ssafy.bbanggu.payment;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/payment")
public class paymentController {

	private final PaymentService paymentService;

	@GetMapping("")
	public ResponseEntity<?> checkPayment(@RequestParam String orderId, @RequestParam String paymentKey,
		@RequestParam int amount) {
		paymentService.check(orderId, paymentKey, amount);
		return null;
	}

}
