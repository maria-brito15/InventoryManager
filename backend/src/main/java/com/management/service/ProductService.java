package com.management.service;

import com.management.model.Product;
import com.management.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

  @Autowired
  private ProductRepository productRepository;

  // CREATE
  public Product saveProduct(Product product) {
    try {
      return productRepository.save(product);
    } catch (Exception e) {
      System.err.println("Erro ao salvar produto: " + e.getMessage());
      throw new RuntimeException("Erro ao salvar produto");
    }
  }

  // LIST
  public List<Product> getAllProducts() {
    try {
      return productRepository.findAll();
    } catch (Exception e) {
      System.err.println("Erro ao buscar produtos: " + e.getMessage());
      throw new RuntimeException("Erro ao buscar produtos");
    }
  }

  // FIND BY ID
  public Product getProductById(Long id) {
    try {
      return productRepository.findById(id).orElse(null);
    } catch (Exception e) {
      System.err.println("Erro ao buscar produto ID " + id + ": " + e.getMessage());
      throw new RuntimeException("Erro ao buscar produto");
    }
  }

  // UPDATE PRODUCT
  public Product updateProduct(Long id, Product productDetails) {
    try {
      Product product = getProductById(id);
      
      if (product == null) {
        return null;
      }
      
      if (productDetails.getName() != null) {
        product.setName(productDetails.getName());
      }

      product.setPrice(productDetails.getPrice());
      product.setQuantity(productDetails.getQuantity());
      
      return productRepository.save(product);
    } catch (Exception e) {
      System.err.println("Erro ao atualizar produto ID " + id + ": " + e.getMessage());
      throw new RuntimeException("Erro ao atualizar produto");
    }
  }

  // DELETE PRODUCT
  public boolean deleteProduct(Long id) {
    try {
      if (productRepository.existsById(id)) {
        productRepository.deleteById(id);
        return true;
      } else {
        return false;
      }
    } catch (Exception e) {
      System.err.println("Erro ao deletar produto ID " + id + ": " + e.getMessage());
      throw new RuntimeException("Erro ao deletar produto");
    }
  }

  // CHECKS IF THE ID EXISTS
  public boolean existsById(Long id) {
    try {
      return productRepository.existsById(id);
    } catch (Exception e) {
      System.err.println("Erro ao verificar existência do produto ID " + id + ": " + e.getMessage());
      return false; 
    }
  }

  // LIST BY NAME CONTAINING
  public List<Product> findByNameContaining(String name) {
    try {
      return productRepository.findByNameContainingIgnoreCase(name);
    } catch (Exception e) {
      System.err.println("Erro ao buscar produtos por nome '" + name + "': " + e.getMessage());
      throw new RuntimeException("Erro ao buscar produtos por nome");
    }
  }

  // SORT BY QUANTITY
  public List<Product> getProductsOrderedByQuantity() {
    try {
      return productRepository.findAllByOrderByQuantityAsc();
    } catch (Exception e) {
      System.err.println("Erro ao buscar produtos ordenados por quantidade: " + e.getMessage());
      throw new RuntimeException("Erro ao buscar produtos ordenados");
    }
  }
}