package com.ssafy.bbanggu.bread;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class BreadDTO {
	private Long breadId;
	private Long bakeryId;
	private Long breadCategoryId;
	private String name;
	private Integer price;
	private String breadImageUrl;
}
