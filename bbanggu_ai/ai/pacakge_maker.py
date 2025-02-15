from itertools import combinations

def distribute_breads(classified_breads, category_infos, class_names):
    # 빵 이름을 id로 변환하는 매핑 생성
    bread_to_id = {name: str(idx + 1) for idx, name in enumerate(class_names)}

    # 총 빵 개수 계산
    total_breads = sum(classified_breads.values())
    max_groups = total_breads // 2  # 최대 묶음 개수

    # 빵 목록을 개수만큼 펼치기
    bread_list = []
    for bread, count in classified_breads.items():
        bread_list.extend([bread] * count)

    all_distributions = {}

    # 1개부터 max_groups까지의 묶음 수에 대해 처리
    for num_groups in range(1, max_groups + 1):
        best_distribution = None
        best_score = float('-inf')  # 점수가 높을수록 좋은 분배

        # 가능한 모든 조합을 시도
        for partition in generate_partitions(bread_list, num_groups):
            # 각 묶음의 가격과 다양성 계산
            group_prices = []
            diversity_scores = []

            for group in partition:
                # 가격 계산
                group_price = sum(category_infos[bread] for bread in group)
                group_prices.append(group_price)

                # 다양성 점수 계산 (unique한 빵 종류 수)
                unique_breads = len(set(group))
                diversity_scores.append(unique_breads)

            # 평가 지표 계산
            price_range = max(group_prices) - min(group_prices)
            avg_diversity = sum(diversity_scores) / len(diversity_scores)
            min_diversity = min(diversity_scores)

            # 종합 점수 계산
            # 가격 차이가 작을수록, 다양성이 높을수록 좋은 점수
            price_score = 1 / (price_range + 1)  # 가격 차이가 작을수록 높은 점수
            diversity_score = avg_diversity + min_diversity  # 다양성이 높을수록 높은 점수

            total_score = price_score + diversity_score * 2  # 가격 균형에 더 높은 가중치

            # 더 좋은 분배를 찾았다면 업데이트
            if total_score > best_score:
                best_score = total_score
                best_distribution = partition

        # 결과 저장
        if best_distribution:
            formatted_groups = []
            for group in best_distribution:
                group_count = {}
                for bread in group:
                    bread_id = bread_to_id[bread]  # 빵 이름을 id로 변환
                    group_count[bread_id] = group_count.get(bread_id, 0) + 1
                group_price = sum(category_infos[bread] for bread in group)
                formatted_groups.append({
                    'breads': group_count,
                    'total_price': group_price
                })
            all_distributions[num_groups] = formatted_groups

    return all_distributions

def generate_partitions(items, num_groups):
    """주어진 아이템을 지정된 그룹 수로 나누는 모든 가능한 조합을 생성"""
    if num_groups == 1:
        yield [items]
        return

    # 첫 번째 그룹에 들어갈 수 있는 아이템 수 범위
    min_items = 2  # 각 그룹은 최소 2개의 빵을 가져야 함
    max_items = len(items) - (num_groups - 1) * 2  # 나머지 그룹들도 최소 2개씩은 가져야 함

    # 가능한 모든 첫 번째 그룹 조합에 대해
    for i in range(min_items, max_items + 1):
        for first_group in combinations(items, i):
            remaining_items = list(items)
            for item in first_group:
                remaining_items.remove(item)

            # 재귀적으로 나머지 아이템들을 나누기
            for sub_partition in generate_partitions(remaining_items, num_groups - 1):
                yield [list(first_group)] + sub_partition


def select_best_combinations(all_distributions, price_limit=10000):
    valid_combinations = []

    # 모든 분배 조합을 순회하며 평가
    for num_groups, distribution in all_distributions.items():
        # 가격 제한 검사
        if any(group['total_price'] > price_limit for group in distribution):
            continue

        # 평가 지표 계산
        group_prices = [group['total_price'] for group in distribution]
        price_range = max(group_prices) - min(group_prices)

        # 각 그룹의 다양성 점수 계산 (unique한 빵 종류 수)
        diversity_scores = [len(group['breads']) for group in distribution]
        avg_diversity = sum(diversity_scores) / len(diversity_scores)
        min_diversity = min(diversity_scores)

        # 종합 점수 계산
        price_score = 1 / (price_range + 1)  # 가격 차이가 작을수록 높은 점수
        diversity_score = avg_diversity + min_diversity
        total_score = price_score + diversity_score * 2

        # 결과 저장
        valid_combinations.append((num_groups, distribution, total_score))

    # 점수를 기준으로 정렬
    valid_combinations.sort(key=lambda x: x[2], reverse=True)

    # 가능한 조합이 3개 미만이면 전체 반환, 아니면 상위 3개 선택
    max_combinations = min(3, len(valid_combinations))
    top_combinations = valid_combinations[:max_combinations]

    # 유효한 조합이 없는 경우 빈 리스트 반환
    if not valid_combinations:
        print("가격 제한을 만족하는 조합이 없습니다.")
        return []

    return [combination[1] for combination in top_combinations]



