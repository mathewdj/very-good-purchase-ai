package com.verygood.purchaseai.purchase

import com.verygood.purchaseai.purchasetype.PurchaseType
import com.verygood.purchaseai.purchasetype.PurchaseTypeRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.domain.PageRequest
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import java.math.BigDecimal
import java.time.LocalDate

@SpringBootTest
@Testcontainers
class PurchaseRepositoryIntegrationTest {

    companion object {
        @Container
        val postgres: PostgreSQLContainer<*> = PostgreSQLContainer("postgres:15-alpine")
            .withDatabaseName("purchaseai")
            .withUsername("purchaseai")
            .withPassword("purchaseai")

        @JvmStatic
        @DynamicPropertySource
        fun configureProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
        }
    }

    @Autowired
    lateinit var purchaseRepository: PurchaseRepository

    @Autowired
    lateinit var purchaseTypeRepository: PurchaseTypeRepository

    @BeforeEach
    fun setUp() {
        purchaseRepository.deleteAll()
        purchaseTypeRepository.deleteAll()
    }

    private fun savedPurchaseType(name: String = "Food") =
        purchaseTypeRepository.save(PurchaseType(name = name))

    private fun savedPurchase(purchaseType: PurchaseType, description: String = "Groceries") =
        purchaseRepository.save(
            Purchase(
                date = LocalDate.of(2024, 1, 15),
                description = description,
                amount = BigDecimal("42.50"),
                purchaseType = purchaseType,
            ),
        )

    @Test
    fun `given purchase exists, when findAllByPurchaseTypeId called, then returns matching purchases`() {
        val purchaseType = savedPurchaseType()
        val purchase = savedPurchase(purchaseType)

        val result = purchaseRepository.findAllByPurchaseTypeId(purchaseType.id)

        assertThat(result).hasSize(1)
        assertThat(result.first().id).isEqualTo(purchase.id)
        assertThat(result.first().purchaseType.id).isEqualTo(purchaseType.id)
    }

    @Test
    fun `given no purchases for type, when findAllByPurchaseTypeId called, then returns empty list`() {
        val purchaseType = savedPurchaseType()
        val otherType = savedPurchaseType("Transport")
        savedPurchase(otherType)

        val result = purchaseRepository.findAllByPurchaseTypeId(purchaseType.id)

        assertThat(result).isEmpty()
    }

    @Test
    fun `given purchase exists for type, when existsByPurchaseTypeId called, then returns true`() {
        val purchaseType = savedPurchaseType()
        savedPurchase(purchaseType)

        assertThat(purchaseRepository.existsByPurchaseTypeId(purchaseType.id)).isTrue()
    }

    @Test
    fun `given no purchases for type, when existsByPurchaseTypeId called, then returns false`() {
        val purchaseType = savedPurchaseType()

        assertThat(purchaseRepository.existsByPurchaseTypeId(purchaseType.id)).isFalse()
    }

    @Test
    fun `given multiple purchases, when findAll with pageable called, then returns paged results`() {
        val purchaseType = savedPurchaseType()
        savedPurchase(purchaseType, "Groceries")
        savedPurchase(purchaseType, "Restaurant")
        savedPurchase(purchaseType, "Coffee")

        val page = purchaseRepository.findAll(PageRequest.of(0, 2))

        assertThat(page.totalElements).isEqualTo(3)
        assertThat(page.content).hasSize(2)
        assertThat(page.totalPages).isEqualTo(2)
    }
}
