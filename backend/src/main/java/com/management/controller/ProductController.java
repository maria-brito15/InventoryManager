package com.management.controller;

import com.management.model.Product;
import com.management.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService productService;

    // GET ALL LIST
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.err.println("Erro ao Buscar Produtos: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // CREATE PRODUCT
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product newProduct) {
        try {
            if (newProduct.getName() == null || newProduct.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Product savedProduct = productService.saveProduct(newProduct);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            System.err.println("Erro ao Criar Produto: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // SEARCH FIND BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        try {
            if (!productService.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

            Product product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            System.err.println("Erro ao Buscar Produto ID " + id + ": " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // SEARCH FIND BY NAME
    @GetMapping("/search")
    public ResponseEntity<List<Product>> findByNameContaining(@RequestParam String name) {
        try {
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            List<Product> products = productService.findByNameContaining(name);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.err.println("Erro ao Buscar Produtos por Nome '" + name + "': " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // UPDATE PRODUCT
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            } else if (product.getId() != null && !product.getId().equals(id)) {
                return ResponseEntity.badRequest().build();
            }

            if (!productService.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

            product.setId(id);
            Product updatedProduct = productService.updateProduct(id, product);

            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            System.err.println("Erro ao Atualizar Produto ID " + id + ": " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // DELETE BY ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        try {
            if (!productService.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

            boolean deleted = productService.deleteProduct(id);

            if (deleted) {
                return ResponseEntity.ok("Produto Deletado Com Sucesso");
            } else {
                return ResponseEntity.internalServerError().body("Erro Ao Deletar Produto");
            }
        } catch (Exception e) {
            System.err.println("Erro ao Deletar Produto ID " + id + ": " + e.getMessage());
            return ResponseEntity.internalServerError().body("Erro Ao Deletar Produto");
        }
    }

    @GetMapping("/exists/{id}")
    public ResponseEntity<String> existsById(@PathVariable Long id) {
        try {
            boolean exists = productService.existsById(id);
            String message = exists ? "Produto Existe!" : "Produto Não Encontrado";

            return ResponseEntity.ok(message);
        } catch (Exception e) {
            System.err.println("Erro ao Verificar Existência do Produto ID " + id + ": " + e.getMessage());
            return ResponseEntity.internalServerError().body("Erro Ao Verificar Produto");
        }
    }

    @GetMapping("/ordered-by-quantity")
    public ResponseEntity<List<Product>> getProductsOrderedByQuantity() {
        try {
            List<Product> products = productService.getProductsOrderedByQuantity();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.err.println("Erro ao Buscar Produtos Ordenados por Quantidade: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}