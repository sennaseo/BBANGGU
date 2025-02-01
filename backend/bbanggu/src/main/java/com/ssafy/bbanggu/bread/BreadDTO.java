package com.ssafy.bbanggu.bread;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BreadDTO {
	private Long breadId;
	private Long bakeryId;
	private Long breadCategoryId;
	private String name;
	private Integer price;
	private String breadImageUrl;
}
