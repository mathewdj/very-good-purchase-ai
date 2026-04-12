package com.verygood.purchaseai.purchasetype

import com.verygood.purchaseai.TestFixtures
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers

@SpringBootTest
@Testcontainers
class PurchaseTypeRepositoryIntegrationTest {

    @Autowired
    lateinit var purchaseTypeRepository: PurchaseTypeRepository

    @BeforeEach
    fun setUp() {
        purchaseTypeRepository.deleteAll()
    }

    private fun savedPurchaseType(name: String = "Food") =
        purchaseTypeRepository.save(TestFixtures.purchaseType(name))

    @Test
    fun `given no types exist, when save called, then type is persisted with generated id`() {
        val saved = savedPurchaseType()

        assertThat(saved.id).isPositive()
        assertThat(saved.name).isEqualTo("Food")
    }

    @Test
    fun `given type exists, when findById called, then returns type`() {
        val saved = savedPurchaseType()

        val result = purchaseTypeRepository.findById(saved.id)

        assertThat(result).isPresent
        assertThat(result.get().name).isEqualTo("Food")
    }

    @Test
    fun `given type does not exist, when findById called, then returns empty`() {
        val result = purchaseTypeRepository.findById(-1L)

        assertThat(result).isEmpty
    }

    @Test
    fun `given multiple types exist, when findAll called, then returns all`() {
        savedPurchaseType("Food")
        savedPurchaseType("Transport")
        savedPurchaseType("Entertainment")

        val result = purchaseTypeRepository.findAll()

        assertThat(result).hasSize(3)
        assertThat(result.map { it.name }).containsExactlyInAnyOrder("Food", "Transport", "Entertainment")
    }

    @Test
    fun `given type exists, when deleteById called, then type no longer exists`() {
        val saved = savedPurchaseType()

        purchaseTypeRepository.deleteById(saved.id)

        assertThat(purchaseTypeRepository.findById(saved.id)).isEmpty
    }

    @Test
    fun `given type with name exists, when save called with same name, then throws DataIntegrityViolationException`() {
        savedPurchaseType("Food")

        assertThatThrownBy { purchaseTypeRepository.saveAndFlush(TestFixtures.purchaseType("Food")) }
            .isInstanceOf(DataIntegrityViolationException::class.java)
    }

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
}
