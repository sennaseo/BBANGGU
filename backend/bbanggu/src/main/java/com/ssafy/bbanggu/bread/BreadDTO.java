package com.ssafy.bbanggu.bread;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BreadDTO {
	private Long breadId;
	private Long bakeryId;
	private Long breadCategoryId;
	private String name;
	private Integer price;
	private String breadImageUrl;
}
