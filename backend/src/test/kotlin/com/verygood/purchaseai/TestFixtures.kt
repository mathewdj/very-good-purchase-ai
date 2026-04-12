package com.verygood.purchaseai

import com.verygood.purchaseai.purchase.Purchase
import com.verygood.purchaseai.purchasetype.PurchaseType
import java.math.BigDecimal
import java.time.LocalDate

object TestFixtures {
    fun purchaseType(name: String = "Food") = PurchaseType(name = name)

    fun purchase(
        purchaseType: PurchaseType = purchaseType(),
        date: LocalDate = LocalDate.of(2024, 1, 15),
        description: String = "Groceries",
        amount: BigDecimal = BigDecimal("42.50"),
    ) = Purchase(
        date = date,
        description = description,
        amount = amount,
        purchaseType = purchaseType,
    )
}
