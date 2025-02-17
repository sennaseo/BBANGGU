from itertools import combinations
from collections import Counter, defaultdict

def distribute_breads(breads, price_limit=10000):
    # 빵 정보 변환 및 기본 검증
    classified_breads = {bread.name: bread.count for bread in breads}
    category_infos = {bread.name: bread.price for bread in breads}

    # 최소 가격의 빵으로만 구성해도 price_limit을 초과하는 그룹 크기 계산
    min_bread_price = min(category_infos.values())
    max_items_per_group = price_limit // min_bread_price

    # 총 빵 개수 계산
    total_breads = sum(classified_breads.values())
    max_groups = total_breads // 2  # 최대 묶음 개수

    # 빵 종류별로 그룹화하여 리스트 생성 (중복 계산 감소)
    bread_list = []
    for bread, count in classified_breads.items():
        bread_list.extend([bread] * count)

    # 빵 종류별 가격을 미리 계산
    bread_type_counts = Counter(bread_list)

    all_distributions = {}
    partition_cache = {}

    def calculate_group_metrics(group):
        """그룹의 가격과 다양성 점수를 계산"""
        group_counter = Counter(group)
        price = sum(category_infos[bread] * count for bread, count in group_counter.items())
        diversity = len(group_counter)
        return price, diversity

    def get_partition_key(items):
        """파티션의 캐시 키 생성"""
        return tuple(sorted(Counter(items).items()))

    def generate_partitions_optimized(items, num_groups):
        """최적화된 파티션 생성 함수"""
        if num_groups == 1:
            yield [items]
            return

        items_key = get_partition_key(items)
        if (items_key, num_groups) in partition_cache:
            yield from partition_cache[(items_key, num_groups)]
            return

        results = []
        min_items = 2
        max_items = min(len(items) - (num_groups - 1) * 2, max_items_per_group)

        if max_items < min_items:
            return

        for i in range(min_items, max_items + 1):
            for first_group in combinations(set(items), min(i, len(set(items)))):
                first_group_counter = Counter(first_group)
                # 각 빵 종류의 개수가 가능한지 확인
                if not all(bread_type_counts[bread] >= count for bread, count in first_group_counter.items()):
                    continue

                # 첫 번째 그룹의 가격 확인
                first_group_price = sum(category_infos[bread] * count for bread, count in first_group_counter.items())
                if first_group_price > price_limit:
                    continue

                remaining_items = list(items)
                for bread in first_group:
                    remaining_items.remove(bread)

                for sub_partition in generate_partitions_optimized(remaining_items, num_groups - 1):
                    result = [list(first_group)] + sub_partition
                    results.append(result)
                    yield result

        partition_cache[(items_key, num_groups)] = results

    # 1개부터 max_groups까지의 묶음 수에 대해 처리
    for num_groups in range(2, max_groups + 1):
        best_distribution = None
        best_score = float('-inf')

        for partition in generate_partitions_optimized(bread_list, num_groups):
            # 각 묶음의 가격과 다양성 계산
            group_metrics = [calculate_group_metrics(group) for group in partition]
            group_prices = [price for price, _ in group_metrics]
            diversity_scores = [diversity for _, diversity in group_metrics]

            # 가격 제한 검사
            if any(price > price_limit for price in group_prices):
                continue

            # 평가 지표 계산
            price_range = max(group_prices) - min(group_prices)
            avg_diversity = sum(diversity_scores) / len(diversity_scores)
            min_diversity = min(diversity_scores)

            # 종합 점수 계산
            price_score = 1 / (price_range + 1)
            diversity_score = avg_diversity + min_diversity
            total_score = price_score + diversity_score * 2

            if total_score > best_score:
                best_score = total_score
                best_distribution = partition

        if best_distribution:
            formatted_groups = []
            for group in best_distribution:
                group_counter = Counter(group)
                group_price = sum(category_infos[bread] * count for bread, count in group_counter.items())
                # 빵 목록을 리스트 형태로 변환
                breads_list = [
                    {
                        'name': bread_name,
                        'quantity': count,
                        'breadId': getattr(bread, 'breadId')
                    }
                    for bread_name, count in group_counter.items()
                    for bread in breads if bread.name == bread_name
                ]
                formatted_groups.append({
                    'breads': breads_list,
                    'total_price': group_price
                })
            all_distributions[num_groups] = formatted_groups

    return select_best_combinations(all_distributions, price_limit)

def select_best_combinations(all_distributions, price_limit=10000):
    valid_combinations = []

    for num_groups, distribution in all_distributions.items():
        if any(group['total_price'] > price_limit for group in distribution):
            continue

        group_prices = [group['total_price'] for group in distribution]
        price_range = max(group_prices) - min(group_prices)

        diversity_scores = [len(group['breads']) for group in distribution]
        avg_diversity = sum(diversity_scores) / len(diversity_scores)
        min_diversity = min(diversity_scores)

        price_score = 1 / (price_range + 1)
        diversity_score = avg_diversity + min_diversity
        total_score = price_score + diversity_score * 2

        valid_combinations.append((num_groups, distribution, total_score))

    valid_combinations.sort(key=lambda x: x[2], reverse=True)
    max_combinations = min(3, len(valid_combinations))

    return [combination[1] for combination in valid_combinations[:max_combinations]] if valid_combinations else []
