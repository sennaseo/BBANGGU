def distribute_breads(bread_dtos):
    # Convert DTO array to required format
    classified_breads = {}
    bread_info = {}

    for dto in bread_dtos:
        dto_dict = dto.dict()
        bread_id = str(dto_dict["breadId"])
        if bread_id not in classified_breads:
            classified_breads[bread_id] = 0
            bread_info[bread_id] = {
                "name": dto_dict["name"],
                "price": dto_dict["price"]
            }
        classified_breads[bread_id] += dto_dict["count"]

    # Calculate total breads
    total_breads = sum(classified_breads.values())
    max_groups = total_breads // 2  # Maximum number of packages possible

    # Create sorted bread list by price (descending) for greedy approach
    bread_list = []
    for bread_id, count in classified_breads.items():
        bread_list.extend([bread_id] * count)

    all_distributions = {}
    distribution_scores = {}

    # Process for each possible number of groups
    for num_groups in range(1, max_groups + 1):
        groups = [[] for _ in range(num_groups)]
        group_prices = [0] * num_groups

        # Sort bread_list by price (descending)
        sorted_breads = sorted(bread_list,
                               key=lambda x: bread_info[x]["price"],
                               reverse=True)

        # Greedy distribution - put each bread into the group with lowest current price
        for bread in sorted_breads:
            min_price_group = min(range(num_groups), key=lambda i: group_prices[i])
            groups[min_price_group].append(bread)
            group_prices[min_price_group] += bread_info[bread]["price"]

        # Calculate scores
        diversity_scores = [len(set(group)) for group in groups]
        price_range = max(group_prices) - min(group_prices)
        avg_diversity = sum(diversity_scores) / len(diversity_scores)
        min_diversity = min(diversity_scores)

        # Calculate total score
        price_score = 1 / (price_range + 1)
        diversity_score = avg_diversity + min_diversity
        total_score = price_score + diversity_score * 2

        # Format the result
        formatted_groups = []
        for group in groups:
            group_count = {}
            for bread_id in group:
                if bread_id not in group_count:
                    group_count[bread_id] = {
                        "name": bread_info[bread_id]["name"],
                        "quantity": 0,
                        "breadId": int(bread_id)
                    }
                group_count[bread_id]["quantity"] += 1

            group_price = sum(bread_info[bread_id]["price"] * count["quantity"]
                              for bread_id, count in group_count.items())

            formatted_groups.append({
                "breads": list(group_count.values()),
                "totalprice": group_price
            })

        # Calculate average package price for this distribution
        avg_package_price = sum(group["totalprice"] for group in formatted_groups) / len(formatted_groups)

        # Only include distributions where average package price is 15000 or less
        if avg_package_price <= 15000:
            all_distributions[num_groups] = formatted_groups
            distribution_scores[num_groups] = total_score

    # Get top 3 distributions by score (if any valid distributions exist)
    if distribution_scores:
        top_distributions = sorted(distribution_scores.items(),
                                   key=lambda x: x[1],
                                   reverse=True)[:3]
        return [all_distributions[num_groups] for num_groups, _ in top_distributions]
    else:
        return []  # Return empty list if no valid distributions found
