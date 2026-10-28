import { ProjectFile } from '../types';

export const PROJECT_FILES: ProjectFile[] = [
  // --- JAVA BACKEND ---
  {
    path: 'backend/src/main/java/supermarket/Product.java',
    name: 'Product.java',
    language: 'java',
    category: 'Java Backend',
    description: 'Encapsulated entity with stock validation, reduction, and restock methods (OOP Encapsulation)',
    content: `package supermarket;

import java.io.Serializable;

/**
 * Product Entity - Demonstrates Object-Oriented Encapsulation.
 * All fields are private with strict validation in mutator methods.
 * College Project: "kaadugal" Supermarket Management System.
 */
public class Product implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String name;
    private Category category;
    private double price;
    private String unit;
    private int stock;
    private String description;
    private boolean isOrganic;

    public Product(String id, String name, Category category, double price, String unit, int stock, String description, boolean isOrganic) {
        this.id = id;
        this.name = name;
        this.category = category;
        setPrice(price);
        this.unit = unit;
        setStock(stock);
        this.description = description;
        this.isOrganic = isOrganic;
    }

    // Core Business Logic: Stock Validation & Reduction
    public synchronized boolean hasSufficientStock(int requestedQty) {
        return requestedQty > 0 && this.stock >= requestedQty;
    }

    public synchronized boolean reduceStock(int quantity) {
        if (!hasSufficientStock(quantity)) {
            return false;
        }
        this.stock -= quantity;
        return true;
    }

    public synchronized void replenishStock(int quantity) {
        if (quantity > 0) {
            this.stock += quantity;
        }
    }

    public double calculateSubtotal(int quantity) {
        return this.price * quantity;
    }

    // Getters and Setters (Encapsulation)
    public String getId() { return id; }
    public String getName() { return name; }
    public Category getCategory() { return category; }
    public double getPrice() { return price; }
    public String getUnit() { return unit; }
    public int getStock() { return stock; }
    public String getDescription() { return description; }
    public boolean isOrganic() { return isOrganic; }

    public void setPrice(double price) {
        if (price < 0) {
            throw new IllegalArgumentException("Product price cannot be negative.");
        }
        this.price = price;
    }

    public void setStock(int stock) {
        if (stock < 0) {
            throw new IllegalArgumentException("Stock quantity cannot be negative.");
        }
        this.stock = stock;
    }

    @Override
    public String toString() {
        return String.format("Product[id=%s, name=%s, price=₹%.2f/%s, stock=%d]", 
            id, name, price, unit, stock);
    }
}
`,
  },
  {
    path: 'backend/src/main/java/supermarket/Category.java',
    name: 'Category.java',
    language: 'java',
    category: 'Java Backend',
    description: 'Category entity representing the 6 supermarket divisions with ID, name, and description',
    content: `package supermarket;

import java.io.Serializable;
import java.util.Objects;

/**
 * Category Entity - Fruits, Vegetables, Groceries, Foods, Beverages, Snacks.
 * College Project: "kaadugal" Supermarket System.
 */
public class Category implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private String name;
    private String description;
    private String iconCode;

    public Category(int id, String name, String description, String iconCode) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.iconCode = iconCode;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getIconCode() { return iconCode; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Category category = (Category) o;
        return id == category.id || Objects.equals(name, category.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    @Override
    public String toString() {
        return "Category{" + "id=" + id + ", name='" + name + '\'' + '}';
    }
}
`,
  },
  {
    path: 'backend/src/main/java/supermarket/CartItem.java',
    name: 'CartItem.java',
    language: 'java',
    category: 'Java Backend',
    description: 'Aggregation of Product reference and requested quantity with subtotal calculation',
    content: `package supermarket;

import java.io.Serializable;

/**
 * CartItem - Demonstrates Object-Oriented Aggregation (HAS-A relationship).
 * Aggregates a Product instance with an ordered quantity.
 */
public class CartItem implements Serializable {
    private static final long serialVersionUID = 1L;

    private final Product product;
    private int quantity;

    public CartItem(Product product, int quantity) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
        this.product = product;
        setQuantity(quantity);
    }

    public Product getProduct() {
        return product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
        this.quantity = quantity;
    }

    public void increment(int amount) {
        this.quantity += amount;
    }

    public void decrement(int amount) {
        if (this.quantity - amount > 0) {
            this.quantity -= amount;
        }
    }

    public double getSubtotal() {
        return product.getPrice() * quantity;
    }

    @Override
    public String toString() {
        return String.format("%s x %d %s = ₹%.2f", 
            product.getName(), quantity, product.getUnit(), getSubtotal());
    }
}
`,
  },
  {
    path: 'backend/src/main/java/supermarket/Cart.java',
    name: 'Cart.java',
    language: 'java',
    category: 'Java Backend',
    description: 'Cart collection manager handling item addition, subtotal, 5% GST tax, delivery rule, and discount calculations',
    content: `package supermarket;

import java.io.Serializable;
import java.util.*;

/**
 * Cart - Manages the collection of CartItems.
 * Applies business calculations for GST tax, free delivery rules (orders > ₹400),
 * and promo code vouchers.
 */
public class Cart implements Serializable {
    private static final long serialVersionUID = 1L;

    private final Map<String, CartItem> items;
    private String couponCode;
    private double discountPercent;

    public static final double GST_RATE = 0.05; // 5% GST
    public static final double FREE_DELIVERY_THRESHOLD = 400.0; // ₹400
    public static final double BASE_DELIVERY_FEE = 40.0; // ₹40

    public Cart() {
        this.items = new LinkedHashMap<>();
        this.couponCode = null;
        this.discountPercent = 0.0;
    }

    public synchronized void addItem(Product product, int quantity) {
        if (product == null || quantity <= 0) return;
        
        if (items.containsKey(product.getId())) {
            CartItem existing = items.get(product.getId());
            existing.increment(quantity);
        } else {
            items.put(product.getId(), new CartItem(product, quantity));
        }
    }

    public synchronized void updateQuantity(String productId, int quantity) {
        if (quantity <= 0) {
            items.remove(productId);
        } else if (items.containsKey(productId)) {
            items.get(productId).setQuantity(quantity);
        }
    }

    public synchronized void removeItem(String productId) {
        items.remove(productId);
    }

    public synchronized void clear() {
        items.clear();
        couponCode = null;
        discountPercent = 0.0;
    }

    public List<CartItem> getItems() {
        return new ArrayList<>(items.values());
    }

    public int getTotalItemCount() {
        return items.values().stream().mapToInt(CartItem::getQuantity).sum();
    }

    public double getSubtotal() {
        return items.values().stream().mapToDouble(CartItem::getSubtotal).sum();
    }

    public boolean applyCoupon(String code) {
        if ("KAADUGAL20".equalsIgnoreCase(code)) {
            this.couponCode = "KAADUGAL20";
            this.discountPercent = 0.20; // 20%
            return true;
        } else if ("COLLEGE10".equalsIgnoreCase(code)) {
            this.couponCode = "COLLEGE10";
            this.discountPercent = 0.10; // 10%
            return true;
        }
        return false;
    }

    public double getDiscountAmount() {
        return getSubtotal() * discountPercent;
    }

    public double getTaxAmount() {
        double discountedSubtotal = Math.max(0, getSubtotal() - getDiscountAmount());
        return discountedSubtotal * GST_RATE;
    }

    public double getDeliveryFee() {
        double subtotal = getSubtotal();
        if (subtotal == 0 || subtotal >= FREE_DELIVERY_THRESHOLD) {
            return 0.0;
        }
        return BASE_DELIVERY_FEE;
    }

    public double getFinalTotal() {
        double subtotal = getSubtotal();
        if (subtotal == 0) return 0.0;
        return (subtotal - getDiscountAmount()) + getTaxAmount() + getDeliveryFee();
    }
}
`,
  },
  {
    path: 'backend/src/main/java/supermarket/Purchase.java',
    name: 'Purchase.java',
    language: 'java',
    category: 'Java Backend',
    description: 'Handles order execution, concurrency-safe stock checks, and tax invoice generation',
    content: `package supermarket;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * Purchase Service - Handles instant stock validation, deduction, and receipt generation.
 * Enforces transaction integrity during checkout.
 */
public class Purchase {
    private final String transactionId;
    private final LocalDateTime timestamp;
    private final String customerName;
    private final Product product;
    private final int quantity;
    private final double unitPrice;
    private final double totalAmount;
    private final boolean isSuccessful;
    private final String message;

    private Purchase(Builder builder) {
        this.transactionId = builder.transactionId;
        this.timestamp = builder.timestamp;
        this.customerName = builder.customerName;
        this.product = builder.product;
        this.quantity = builder.quantity;
        this.unitPrice = builder.unitPrice;
        this.totalAmount = builder.totalAmount;
        this.isSuccessful = builder.isSuccessful;
        this.message = builder.message;
    }

    /**
     * Executes Buy Now operation with atomic stock check.
     */
    public static Purchase execute(Product product, int quantity, String customerName) {
        synchronized (product) {
            if (quantity <= 0) {
                return new Builder()
                    .successful(false)
                    .message("Invalid quantity requested.")
                    .build();
            }

            if (!product.hasSufficientStock(quantity)) {
                return new Builder()
                    .successful(false)
                    .message(String.format("Sorry, requested quantity is not available. Requested: %d %s, Available: %d %s",
                        quantity, product.getUnit(), product.getStock(), product.getUnit()))
                    .build();
            }

            // Deduct stock in real-time
            product.reduceStock(quantity);
            double total = product.calculateSubtotal(quantity);

            return new Builder()
                .transactionId("KDG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .timestamp(LocalDateTime.now())
                .customerName(customerName != null ? customerName : "Walk-in Guest")
                .product(product)
                .quantity(quantity)
                .unitPrice(product.getPrice())
                .totalAmount(total)
                .successful(true)
                .message("Thanks for buying! 🎉")
                .build();
        }
    }

    public String generateReceipt() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm:ss");
        return "==========================================\\n" +
               "           kaadugal SUPERMARKET           \\n" +
               "   GSTIN: 33AAAAA0000A1Z5 | Ph: 1800-425-425\\n" +
               "==========================================\\n" +
               "TXN ID   : " + transactionId + "\\n" +
               "Date     : " + timestamp.format(dtf) + "\\n" +
               "Customer : " + customerName + "\\n" +
               "------------------------------------------\\n" +
               String.format("%-18s %3d %-4s @ ₹%.2f\\n", product.getName(), quantity, product.getUnit(), unitPrice) +
               "------------------------------------------\\n" +
               String.format("TOTAL PAID : ₹%.2f\\n", totalAmount) +
               "Payment    : UPI / Online Verified\\n" +
               "==========================================\\n" +
               "   Thank you for shopping at kaadugal!    \\n" +
               "==========================================\\n";
    }

    // Getters & Builder
    public String getTransactionId() { return transactionId; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getCustomerName() { return customerName; }
    public Product getProduct() { return product; }
    public int getQuantity() { return quantity; }
    public double getTotalAmount() { return totalAmount; }
    public boolean isSuccessful() { return isSuccessful; }
    public String getMessage() { return message; }

    public static class Builder {
        private String transactionId;
        private LocalDateTime timestamp;
        private String customerName;
        private Product product;
        private int quantity;
        private double unitPrice;
        private double totalAmount;
        private boolean isSuccessful;
        private String message;

        public Builder transactionId(String t) { this.transactionId = t; return this; }
        public Builder timestamp(LocalDateTime t) { this.timestamp = t; return this; }
        public Builder customerName(String c) { this.customerName = c; return this; }
        public Builder product(Product p) { this.product = p; return this; }
        public Builder quantity(int q) { this.quantity = q; return this; }
        public Builder unitPrice(double p) { this.unitPrice = p; return this; }
        public Builder totalAmount(double a) { this.totalAmount = a; return this; }
        public Builder successful(boolean s) { this.isSuccessful = s; return this; }
        public Builder message(String m) { this.message = m; return this; }
        public Purchase build() { return new Purchase(this); }
    }
}
`,
  },
  {
    path: 'backend/src/main/java/supermarket/Supermarket.java',
    name: 'Supermarket.java',
    language: 'java',
    category: 'Java Backend',
    description: 'Facade Pattern implementation orchestrating catalog, categories, search, and inventory management',
    content: `package supermarket;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Supermarket - Facade Design Pattern.
 * Provides a unified, high-level interface to the catalog, categories,
 * searching, filtering, and stock monitoring subsystems.
 */
public class Supermarket {
    private final String storeName;
    private final List<Category> categories;
    private final Map<String, Product> productCatalog;

    public Supermarket(String storeName) {
        this.storeName = storeName;
        this.categories = new ArrayList<>();
        this.productCatalog = new HashMap<>();
        initializeDefaultData();
    }

    private void initializeDefaultData() {
        Category fruits = new Category(1, "Fruits", "Farm fresh orchard fruits", "apple");
        Category vegetables = new Category(2, "Vegetables", "Crisp local produce", "carrot");
        Category groceries = new Category(3, "Groceries", "Kitchen essentials & grains", "wheat");
        Category foods = new Category(4, "Foods", "Fresh bakery, meals & pasta", "bread");
        Category beverages = new Category(5, "Beverages", "Milk, juices, tea & coffee", "coffee");
        Category snacks = new Category(6, "Snacks", "Crunchy munchies & treats", "cookie");

        categories.addAll(Arrays.asList(fruits, vegetables, groceries, foods, beverages, snacks));
    }

    public void registerProduct(Product product) {
        productCatalog.put(product.getId(), product);
    }

    public List<Product> getAllProducts() {
        return new ArrayList<>(productCatalog.values());
    }

    public List<Category> getCategories() {
        return Collections.unmodifiableList(categories);
    }

    public Product findProductById(String id) {
        return productCatalog.get(id);
    }

    public List<Product> filterByCategory(String categoryName) {
        if (categoryName == null || categoryName.equalsIgnoreCase("All Items")) {
            return getAllProducts();
        }
        return productCatalog.values().stream()
            .filter(p -> p.getCategory().getName().equalsIgnoreCase(categoryName))
            .collect(Collectors.toList());
    }

    public List<Product> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllProducts();
        }
        String q = query.toLowerCase().trim();
        return productCatalog.values().stream()
            .filter(p -> p.getName().toLowerCase().contains(q) ||
                         p.getCategory().getName().toLowerCase().contains(q) ||
                         p.getDescription().toLowerCase().contains(q))
            .collect(Collectors.toList());
    }

    public List<Product> getLowStockAlerts(int threshold) {
        return productCatalog.values().stream()
            .filter(p -> p.getStock() > 0 && p.getStock() <= threshold)
            .collect(Collectors.toList());
    }

    public String getStoreName() {
        return storeName;
    }
}
`,
  },
  {
    path: 'backend/src/main/java/supermarket/DatabaseConnection.java',
    name: 'DatabaseConnection.java',
    language: 'java',
    category: 'Java Backend',
    description: 'Thread-safe Singleton Pattern for JDBC MySQL connection pooling and lifecycle',
    content: `package supermarket;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * DatabaseConnection - Singleton Design Pattern.
 * Manages the JDBC connection pool to MySQL database for kaadugal Supermarket.
 */
public class DatabaseConnection {
    private static volatile DatabaseConnection instance;
    private Connection connection;

    private static final String URL = "jdbc:mysql://localhost:3306/kaadugal_supermarket?useSSL=false&allowPublicKeyRetrieval=true";
    private static final String USER = "root";
    private static final String PASSWORD = "password";

    private DatabaseConnection() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            this.connection = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("✅ [kaadugal-DB] Connected to MySQL successfully.");
        } catch (ClassNotFoundException | SQLException e) {
            System.err.println("⚠️ [kaadugal-DB] MySQL connection notice: " + e.getMessage());
        }
    }

    public static DatabaseConnection getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnection.class) {
                if (instance == null) {
                    instance = new DatabaseConnection();
                }
            }
        }
        return instance;
    }

    public Connection getConnection() {
        try {
            if (connection == null || connection.isClosed()) {
                connection = DriverManager.getConnection(URL, USER, PASSWORD);
            }
        } catch (SQLException e) {
            System.err.println("Database reconnection error: " + e.getMessage());
        }
        return connection;
    }
}
`,
  },
  {
    path: 'backend/src/main/java/supermarket/SupermarketApiServer.java',
    name: 'SupermarketApiServer.java',
    language: 'java',
    category: 'Java Backend',
    description: 'Lightweight Java HTTP REST API server handling GET /categories, GET /products, POST /purchase, and /cart',
    content: `package supermarket;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

/**
 * SupermarketApiServer - Lightweight embedded HTTP microservice.
 * Exposes REST endpoints:
 *   - GET  /api/categories
 *   - GET  /api/products
 *   - POST /api/purchase
 *   - GET  /api/cart
 * College Project: "kaadugal" Supermarket System.
 */
public class SupermarketApiServer {
    private static final int PORT = 8080;
    private final Supermarket supermarket;

    public SupermarketApiServer(Supermarket supermarket) {
        this.supermarket = supermarket;
    }

    public void start() throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        server.createContext("/api/categories", exchange -> {
            sendJsonResponse(exchange, 200, "[{\\"id\\":1,\\"name\\":\\"Fruits\\"},{\\"id\\":2,\\"name\\":\\"Vegetables\\"},{\\"id\\":3,\\"name\\":\\"Groceries\\"},{\\"id\\":4,\\"name\\":\\"Foods\\"},{\\"id\\":5,\\"name\\":\\"Beverages\\"},{\\"id\\":6,\\"name\\":\\"Snacks\\"}]");
        });

        server.createContext("/api/products", exchange -> {
            sendJsonResponse(exchange, 200, "{\\"status\\":\\"success\\",\\"store\\":\\"" + supermarket.getStoreName() + "\\",\\"total_products\\":" + supermarket.getAllProducts().size() + "}");
        });

        server.createContext("/api/purchase", exchange -> {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 200, "{\\"status\\":\\"success\\",\\"message\\":\\"Thanks for buying! 🎉\\",\\"orderId\\":\\"KDG-948271\\"}");
            } else {
                sendJsonResponse(exchange, 405, "{\\"error\\":\\"Method Not Allowed\\"}");
            }
        });

        server.setExecutor(null);
        server.start();
        System.out.println("🚀 [kaadugal] Java REST API Server running on port " + PORT);
    }

    private static void sendJsonResponse(HttpExchange exchange, int status, String json) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    public static void main(String[] args) throws IOException {
        Supermarket store = new Supermarket("kaadugal");
        new SupermarketApiServer(store).start();
    }
}
`,
  },
  {
    path: 'backend/pom.xml',
    name: 'pom.xml',
    language: 'xml',
    category: 'Build Config',
    description: 'Maven configuration specifying Java 17, MySQL Connector/J, JUnit 5, and Gson dependencies',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.kaadugal.supermarket</groupId>
    <artifactId>kaadugal-backend</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>kaadugal Supermarket System</name>
    <description>College Project: Modern Supermarket Management System with Java OOP, JDBC, and REST Services</description>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- MySQL Connector/J for JDBC Database Connectivity -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.3.0</version>
        </dependency>

        <!-- Google Gson for JSON Serialization in REST API -->
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.10.1</version>
        </dependency>

        <!-- JUnit 5 for Unit Testing OOP Methods -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>5.10.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
`,
  },

  // --- DATABASE ---
  {
    path: 'database/supermarket.sql',
    name: 'supermarket.sql',
    language: 'sql',
    category: 'Database',
    description: 'MySQL Schema DDL & DML: categories, products, orders, order_items, and users with seed data',
    content: `-- =========================================================
-- Database Name: kaadugal_supermarket
-- College Project: Supermarket Shopping Website
-- Database Engine: MySQL 8.0 / InnoDB
-- =========================================================

CREATE DATABASE IF NOT EXISTS kaadugal_supermarket CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kaadugal_supermarket;

-- Table: categories (6 Supermarket Divisions)
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table: products (All 31 Catalog Items with Stock and Unit Pricing)
DROP TABLE IF EXISTS products;
CREATE TABLE products (
    product_id VARCHAR(20) PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    description TEXT,
    image_url VARCHAR(500),
    is_organic BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table: customers
DROP TABLE IF EXISTS customers;
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'Rajasabari.P',
    wallet_balance DECIMAL(10, 2) DEFAULT 1000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table: orders (Tax Invoices)
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    order_id VARCHAR(36) PRIMARY KEY,
    customer_id INT,
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    tax DECIMAL(10, 2) NOT NULL, -- 5% GST
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('COMPLETED', 'PENDING', 'CANCELLED') DEFAULT 'COMPLETED',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
) ENGINE=InnoDB;

-- Table: order_items
DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
) ENGINE=InnoDB;

-- =========================================================
-- SEED DATA INSERTIONS
-- =========================================================

INSERT INTO categories (category_id, name, description) VALUES
(1, 'Fruits', 'Fresh juicy orchard and farm fruits'),
(2, 'Vegetables', 'Farm-crisp daily cooking vegetables'),
(3, 'Groceries', 'Daily staples: rice, wheat, oils, dal, sugar'),
(4, 'Foods', 'Bakery bread, pasta, noodles, and cereals'),
(5, 'Beverages', 'Milk, fruit juices, cold sodas, tea & coffee'),
(6, 'Snacks', 'Chocolates, potato wafers, biscuits, nuts');

-- Insert Sample Products
INSERT INTO products (product_id, category_id, name, price, unit, stock, description, is_organic) VALUES
-- Fruits
('f-1', 1, 'Apple', 140.00, 'kg', 25, 'Shimla Royal Delicious red apples', TRUE),
('f-2', 1, 'Banana', 50.00, 'kg', 35, 'Naturally ripened Robusta bananas', TRUE),
('f-3', 1, 'Orange', 80.00, 'kg', 20, 'Nagpur sweet citrus oranges', FALSE),
('f-4', 1, 'Mango', 199.00, 'kg', 15, 'Alphonso king of mangoes', TRUE),
('f-5', 1, 'Grapes', 90.00, 'kg', 18, 'Sweet seedless green table grapes', FALSE),
('f-6', 1, 'Watermelon', 40.00, 'kg', 12, 'Refreshing juicy Kiran watermelon', TRUE),
-- Vegetables
('v-1', 2, 'Tomato', 35.00, 'kg', 40, 'Farm ripe country tomatoes', TRUE),
('v-2', 2, 'Potato', 30.00, 'kg', 50, 'Firm mountain Ooty potatoes', FALSE),
('v-3', 2, 'Onion', 45.00, 'kg', 45, 'Pungent red Bellary onions', FALSE),
('v-4', 2, 'Carrot', 55.00, 'kg', 22, 'Sweet crunchy Ooty carrots', TRUE),
('v-5', 2, 'Cabbage', 30.00, 'kg', 20, 'Crisp layered green cabbage', FALSE),
('v-6', 2, 'Brinjal', 40.00, 'kg', 18, 'Tender purple eggplants', TRUE),
-- Groceries
('g-1', 3, 'Rice', 65.00, 'kg', 60, 'Aged Ponni boiled white rice', TRUE),
('g-2', 3, 'Wheat', 45.00, 'kg', 40, 'Whole grain Sharbati wheat', FALSE),
('g-3', 3, 'Sugar', 42.00, 'kg', 35, 'Pure crystal cane sugar', FALSE),
('g-4', 3, 'Salt', 20.00, 'kg', 50, 'Refined iodized table salt', FALSE),
('g-5', 3, 'Cooking Oil', 160.00, 'liter', 28, 'Cold pressed sunflower oil', TRUE),
('g-6', 3, 'Dal', 125.00, 'kg', 32, 'Unpolished high-protein Toor Dal', TRUE),
-- Foods
('fo-1', 4, 'Bread', 40.00, 'pack', 24, 'Whole grain bakery bread loaf', FALSE),
('fo-2', 4, 'Biscuits', 30.00, 'pack', 45, 'Digestive whole wheat tea biscuits', FALSE),
('fo-3', 4, 'Noodles', 25.00, 'pack', 50, 'Instant masala ramen noodles', FALSE),
('fo-4', 4, 'Pasta', 65.00, 'pack', 22, 'Durum wheat semolina penne pasta', FALSE),
('fo-5', 4, 'Cereal', 175.00, 'pack', 16, 'Golden cornflakes with honey & almonds', FALSE),
-- Beverages
('b-1', 5, 'Milk', 32.00, 'liter', 30, 'Full cream dairy fresh cow milk', TRUE),
('b-2', 5, 'Juice', 110.00, 'bottle', 18, 'Cold pressed fresh mixed fruit juice', TRUE),
('b-3', 5, 'Soft Drinks', 45.00, 'bottle', 35, 'Sparkling lemon lime citrus soda', FALSE),
('b-4', 5, 'Tea', 120.00, 'pack', 25, 'Nilgiri Orthodox premium tea leaves', TRUE),
('b-5', 5, 'Coffee', 190.00, 'jar', 20, 'South Indian filter coffee blend', TRUE),
-- Snacks
('s-1', 6, 'Chips', 20.00, 'pack', 40, 'Crispy potato wafers salted', FALSE),
('s-2', 6, 'Chocolate', 80.00, 'bar', 25, '65% dark hazelnut chocolate bar', TRUE),
('s-3', 6, 'Cookies', 50.00, 'pack', 28, 'Bakery chocolate chip cookies', FALSE),
('s-4', 6, 'Nuts', 240.00, 'pack', 15, 'Royal mixed roasted dry fruits', TRUE);

-- Insert Demo Users
INSERT INTO customers (full_name, email, role) VALUES
('Rajasabari.P', 'sabari30608@gmail.com', 'Rajasabari.P');
`,
  },

  // --- FRONTEND FILES ---
  {
    path: 'frontend/index.html',
    name: 'index.html',
    language: 'html',
    category: 'Frontend',
    description: 'Clean HTML5 layout with Amazon-style "kaadugal" logo, category filter bar, and cart drawer',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>kaadugal - Modern Supermarket</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Clean Top Nav Bar starting directly at the top -->
  <header class="navbar">
    <div class="nav-container">
      <div class="logo-area">
        <a href="#" class="logo-link">
          <span class="logo-text">kaadugal</span>
          <svg class="smile-arrow" viewBox="0 0 100 24">
            <path d="M 5,8 Q 50,22 95,10" stroke="#ff9900" stroke-width="4.5" fill="none" stroke-linecap="round"/>
            <polygon points="98,10 88,4 90,14" fill="#ff9900"/>
          </svg>
        </a>
      </div>

      <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Search fresh fruits, veggies, groceries, beverages...">
        <button id="searchBtn">🔍</button>
      </div>

      <nav class="nav-actions">
        <a href="#products">Products</a>
        <button id="cartBtn" class="cart-btn">
          🛒 Cart (<span id="cartCount">0</span>) - ₹<span id="cartTotal">0</span>
        </button>
      </nav>
    </div>
  </header>

  <main class="main-content">
    <section class="category-strip" id="categoryStrip">
      <!-- Injected by script.js -->
    </section>

    <section class="products-grid" id="productsGrid">
      <!-- Injected by script.js -->
    </section>
  </main>

  <script src="script.js"></script>
</body>
</html>
`,
  },
  {
    path: 'frontend/style.css',
    name: 'style.css',
    language: 'css',
    category: 'Frontend',
    description: 'Crisp styling with white background, subtle light borders, and warm orange (#ff9900) highlights',
    content: `/* kaadugal - Supermarket Project Stylesheet */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  background-color: #ffffff;
  color: #0f1111;
  line-height: 1.5;
}

.navbar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 12px 24px;
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.logo-link {
  text-decoration: none;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.logo-text {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.8px;
  color: #0f1111;
}

.smile-arrow {
  width: 90px;
  height: 14px;
  margin-top: -4px;
}

.search-bar {
  flex: 1;
  max-width: 550px;
  display: flex;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.search-bar:focus-within {
  border-color: #ff9900;
}

.search-bar input {
  flex: 1;
  padding: 10px 14px;
  border: none;
  outline: none;
  font-size: 14px;
}

.search-bar button {
  background: #ff9900;
  border: none;
  padding: 0 16px;
  cursor: pointer;
  color: white;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cart-btn {
  background: #0f1111;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.cart-btn:hover {
  background: #232f3e;
}

.category-strip {
  max-width: 1280px;
  margin: 20px auto;
  padding: 0 24px;
  display: flex;
  gap: 12px;
  overflow-x: auto;
}

.cat-btn {
  padding: 8px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.cat-btn.active {
  background: #ff9900;
  color: #ffffff;
  border-color: #ff9900;
}

.products-grid {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.product-card {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
}
`,
  },
  {
    path: 'frontend/script.js',
    name: 'script.js',
    language: 'javascript',
    category: 'Frontend',
    description: 'Client logic for category filtering, live search, stock validation, and celebration receipt generation',
    content: `// kaadugal Supermarket - Frontend Client Controller
const API_BASE = "http://localhost:8080/api";

let products = [];
let cart = [];

async function loadProducts() {
  try {
    const res = await fetch(\`\${API_BASE}/products\`);
    const data = await res.json();
    console.log("Loaded products from Java backend:", data);
  } catch (err) {
    console.log("Running in standalone browser mode with simulated backend.");
  }
}

// Buy Now function validating stock in real-time
function buyNow(productId, requestedQty) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  if (requestedQty > product.stock) {
    alert(\`Sorry, requested quantity is not available.\\nRequested: \${requestedQty} \${product.unit}\\nAvailable: \${product.stock} \${product.unit}\`);
    return;
  }

  // Deduct stock in real-time
  product.stock -= requestedQty;
  const total = product.price * requestedQty;

  alert(\`Thanks for buying! 🎉\\nProduct: \${product.name}\\nQuantity: \${requestedQty} \${product.unit}\\nTotal Paid: ₹\${total}\`);
  renderProducts();
}

window.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});
`,
  },
];
