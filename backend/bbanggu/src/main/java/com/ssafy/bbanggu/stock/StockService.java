package com.ssafy.bbanggu.stock;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.bbanggu.bread.Bread;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StockService {
	private final StockRepository stockRepository;

	public Bread insertStock() {
		return null;
	}
}
