import React, { useState } from 'react';
import {
  Code2,
  Download,
  Copy,
  Check,
  Server,
  FolderTree,
  BookOpen,
  Send,
  Layers,
  FileCode2,
  Database,
  Terminal,
  ExternalLink,
  X,
} from 'lucide-react';
import JSZip from 'jszip';
import { PROJECT_FILES } from '../data/projectFiles';
import { ProjectFile } from '../types';

interface ProjectHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectHubModal: React.FC<ProjectHubModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'files' | 'api' | 'architecture' | 'viva'>('files');
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // API Tester state
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/categories');
  const [httpMethod, setHttpMethod] = useState<'GET' | 'POST'>('GET');
  const [requestPayload, setRequestPayload] = useState<string>(
    JSON.stringify({ productId: 'f-1', quantity: 2, customerName: 'Rajasabari.P' }, null, 2)
  );
  const [apiResponse, setApiResponse] = useState<string>(
    JSON.stringify(
      [
        { id: 1, name: 'Fruits', count: 6 },
        { id: 2, name: 'Vegetables', count: 6 },
        { id: 3, name: 'Groceries', count: 6 },
        { id: 4, name: 'Foods', count: 5 },
        { id: 5, name: 'Beverages', count: 5 },
        { id: 6, name: 'Snacks', count: 4 },
      ],
      null,
      2
    )
  );
  const [responseStatus, setResponseStatus] = useState<number>(200);
  const [responseTime, setResponseTime] = useState<number>(14);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add README for college submission
      zip.file(
        'README.md',
        `# kaadugal - Supermarket Shopping System
College Project Academic Submission
Technology Stack: Java 17, MySQL 8.0, JDBC, REST API, HTML5/CSS3/Vanilla JS

## Directory Structure:
Supermarket-Website/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   ├── pom.xml
│   └── src/main/java/supermarket/
│       ├── Product.java             (Encapsulated entity, stock reduction validation)
│       ├── Category.java            (Category entity)
│       ├── Cart.java                (Collection management, subtotal & tax methods)
│       ├── CartItem.java            (Aggregation of Product and quantity)
│       ├── Purchase.java            (Stock checks, price calculation, receipt generation)
│       ├── Supermarket.java         (Catalog facade, category filtering, search)
│       ├── DatabaseConnection.java  (JDBC MySQL connection singleton)
│       └── SupermarketApiServer.java(Java HTTP REST server exposing /categories, /products, /cart, /purchase)
└── database/
    └── supermarket.sql              (MySQL DDL schema and seed data)

## How to Run:
1. Import database/supermarket.sql into MySQL Server (Port 3306).
2. Open backend/ in IntelliJ IDEA, Eclipse, or NetBeans.
3. Build with Maven: mvn clean compile
4. Run SupermarketApiServer.java main method.
5. Open frontend/index.html in any browser.
`
      );

      // Package each file into the exact structure
      PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'kaadugal-supermarket-college-project.zip';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('ZIP generation failed:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleExecuteApi = () => {
    const start = performance.now();
    if (selectedEndpoint === '/api/categories') {
      setResponseStatus(200);
      setApiResponse(
        JSON.stringify(
          [
            { id: 1, name: 'Fruits', itemCount: 6 },
            { id: 2, name: 'Vegetables', itemCount: 6 },
            { id: 3, name: 'Groceries', itemCount: 6 },
            { id: 4, name: 'Foods', itemCount: 5 },
            { id: 5, name: 'Beverages', itemCount: 5 },
            { id: 6, name: 'Snacks', itemCount: 4 },
          ],
          null,
          2
        )
      );
    } else if (selectedEndpoint === '/api/products') {
      setResponseStatus(200);
      setApiResponse(
        JSON.stringify(
          {
            status: 'success',
            supermarket: 'kaadugal',
            currency: 'INR (₹)',
            totalItems: 32,
            categories: 6,
            sampleCatalog: [
              { id: 'f-1', name: 'Apple', price: 140, unit: 'kg', stock: 25 },
              { id: 'v-1', name: 'Tomato', price: 35, unit: 'kg', stock: 40 },
              { id: 'g-1', name: 'Rice', price: 65, unit: 'kg', stock: 60 },
            ],
          },
          null,
          2
        )
      );
    } else if (selectedEndpoint === '/api/purchase') {
      try {
        const payload = JSON.parse(requestPayload);
        const qty = payload.quantity || 1;
        setResponseStatus(200);
        setApiResponse(
          JSON.stringify(
            {
              status: 'success',
              message: 'Thanks for buying! 🎉',
              transactionId: `KDG-${Math.floor(100000 + Math.random() * 900000)}`,
              customer: payload.customerName || 'Rajasabari.P',
              productId: payload.productId || 'f-1',
              purchasedQty: qty,
              totalPaid: qty * 140,
              stockUpdated: true,
              timestamp: new Date().toISOString(),
            },
            null,
            2
          )
        );
      } catch (e) {
        setResponseStatus(400);
        setApiResponse(
          JSON.stringify({ error: 'Invalid JSON Body format in purchase request' }, null, 2)
        );
      }
    } else if (selectedEndpoint === '/api/cart') {
      setResponseStatus(200);
      setApiResponse(
        JSON.stringify(
          {
            cartSession: 'active',
            items: [
              { productId: 'g-1', name: 'Rice', quantity: 2, subtotal: 130 },
              { productId: 'f-4', name: 'Mango', quantity: 1, subtotal: 199 },
            ],
            subtotal: 329,
            gst5Percent: 16.45,
            deliveryFee: 40.0,
            freeDeliveryEligible: false,
            freeDeliveryThreshold: 400.0,
            finalTotal: 385.45,
          },
          null,
          2
        )
      );
    }
    setResponseTime(Math.round(performance.now() - start + 8));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0d1117] text-slate-200 rounded-2xl shadow-2xl border border-slate-800 my-4 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#161b22] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#ff9900]">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Academic Project Hub</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Java OOP + MySQL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Supermarket Management System • College Final Year / Semester Submission
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-[#ff9900] hover:bg-[#e68a00] text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Packaging ZIP...' : 'Download Project ZIP'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-[#0d1117] px-6 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'files'
                ? 'border-[#ff9900] text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            Source Files ({PROJECT_FILES.length})
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'api'
                ? 'border-[#ff9900] text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            REST API Tester
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'border-[#ff9900] text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            OOP Design Patterns
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'viva'
                ? 'border-[#ff9900] text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Viva-Voce Q&A Guide
          </button>
        </div>

        {/* Main Tab Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* TAB 1: SOURCE FILES EXPLORER */}
          {activeTab === 'files' && (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden h-full">
              {/* File Tree Left Sidebar */}
              <div className="md:col-span-4 bg-[#161b22] border-r border-slate-800 p-4 overflow-y-auto space-y-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
                  Project Directory
                </div>

                <div className="space-y-1">
                  {PROJECT_FILES.map((file) => {
                    const isSelected = selectedFile.path === file.path;
                    return (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFile(file)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        {file.category === 'Database' ? (
                          <Database className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                        ) : file.category === 'Build Config' ? (
                          <FileCode2 className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                        ) : file.category === 'Frontend' ? (
                          <Terminal className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                        ) : (
                          <Code2 className="w-4 h-4 shrink-0 text-[#ff9900] mt-0.5" />
                        )}

                        <div className="min-w-0">
                          <div className="font-mono font-semibold truncate">{file.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{file.path}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Code Viewer */}
              <div className="md:col-span-8 flex flex-col bg-[#0d1117] overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-[#161b22]/50">
                  <div>
                    <span className="font-mono text-xs text-white font-semibold">
                      {selectedFile.path}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed bg-[#0d1117]">
                  <pre>
                    <code>{selectedFile.content}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REST API TESTER */}
          {activeTab === 'api' && (
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-[#161b22] border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <select
                    value={selectedEndpoint}
                    onChange={(e) => {
                      const ep = e.target.value;
                      setSelectedEndpoint(ep);
                      if (ep === '/api/purchase') {
                        setHttpMethod('POST');
                      } else {
                        setHttpMethod('GET');
                      }
                    }}
                    className="bg-[#0d1117] border border-slate-700 text-white text-xs font-mono rounded-lg px-3 py-2 outline-none focus:border-amber-500"
                  >
                    <option value="/api/categories">GET /api/categories (List all 6 categories)</option>
                    <option value="/api/products">GET /api/products (Retrieve catalog summary)</option>
                    <option value="/api/purchase">POST /api/purchase (Validate stock & place order)</option>
                    <option value="/api/cart">GET /api/cart (Get current cart session)</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/20">
                      {httpMethod}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      http://localhost:8080{selectedEndpoint}
                    </span>
                  </div>

                  <button
                    onClick={handleExecuteApi}
                    className="sm:ml-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#ff9900] hover:bg-[#e68a00] text-slate-950 font-bold text-xs rounded-lg transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Request</span>
                  </button>
                </div>

                {httpMethod === 'POST' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Request Body (JSON):
                    </label>
                    <textarea
                      value={requestPayload}
                      onChange={(e) => setRequestPayload(e.target.value)}
                      rows={4}
                      className="w-full font-mono text-xs bg-[#0d1117] border border-slate-700 text-slate-200 rounded-lg p-3 outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>

              {/* API Response Display */}
              <div className="bg-[#161b22] border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#1c2128] border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">Status:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      {responseStatus} OK
                    </span>
                  </div>
                  <div className="text-slate-400">Response Time: {responseTime}ms</div>
                </div>

                <div className="p-4 font-mono text-xs text-emerald-400 overflow-x-auto bg-[#0d1117]">
                  <pre>
                    <code>{apiResponse}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OOP ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#161b22] border border-slate-800 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    1. Encapsulation & Data Hiding
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    Demonstrated in <code className="text-amber-400">Product.java</code>. Fields
                    such as <code className="text-amber-400">price</code>, <code className="text-amber-400">stock</code>,
                    and <code className="text-amber-400">name</code> are strictly private. The
                    <code className="text-amber-400">reduceStock()</code> method checks sufficiency
                    before mutator execution to prevent negative stock conditions.
                  </p>
                </div>

                <div className="p-4 bg-[#161b22] border border-slate-800 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    2. Aggregation (HAS-A Relationship)
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    Implemented in <code className="text-cyan-400">CartItem.java</code>. Each cart
                    item aggregates a reference to a <code className="text-cyan-400">Product</code> and an integer
                    <code className="text-cyan-400">quantity</code>. The product can exist independently
                    even if the cart item is removed.
                  </p>
                </div>

                <div className="p-4 bg-[#161b22] border border-slate-800 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    3. Singleton Pattern
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    Implemented in <code className="text-emerald-400">DatabaseConnection.java</code>.
                    Uses double-checked locking to provide a single, thread-safe JDBC connection
                    instance to the MySQL <code className="text-emerald-400">kaadugal_supermarket</code> database.
                  </p>
                </div>

                <div className="p-4 bg-[#161b22] border border-slate-800 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    4. Facade Pattern
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    Implemented in <code className="text-purple-400">Supermarket.java</code>. Wraps
                    underlying subsystems (catalog indexing, category filtering, search, low-stock threshold triggers)
                    behind a clean, unified API for controllers and clients.
                  </p>
                </div>
              </div>

              {/* Layered Architecture diagram */}
              <div className="p-4 bg-[#161b22] border border-slate-800 rounded-xl space-y-3">
                <h4 className="font-bold text-sm text-white">System 3-Tier Layered Architecture</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-[#0d1117] border border-slate-800 rounded-lg">
                    <div className="font-bold text-amber-400 mb-1">Presentation Layer</div>
                    <div className="text-[11px] text-slate-400">
                      HTML5, CSS3, React, Tailwind CSS, Responsive UI
                    </div>
                  </div>
                  <div className="p-3 bg-[#0d1117] border border-slate-800 rounded-lg">
                    <div className="font-bold text-cyan-400 mb-1">Business Logic Layer</div>
                    <div className="text-[11px] text-slate-400">
                      Java 17 OOP Classes, Purchase atomicity, Cart & Tax Engine
                    </div>
                  </div>
                  <div className="p-3 bg-[#0d1117] border border-slate-800 rounded-lg">
                    <div className="font-bold text-emerald-400 mb-1">Data Persistence Layer</div>
                    <div className="text-[11px] text-slate-400">
                      MySQL 8.0 InnoDB, JDBC Connection Pool, SQL Transactions
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VIVA-VOCE Q&A GUIDE */}
          {activeTab === 'viva' && (
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 bg-[#161b22] border border-slate-800 rounded-xl space-y-1.5">
                <span className="font-bold text-amber-400 text-sm block">
                  Q1: How does your system prevent negative inventory when two users buy the last item?
                </span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> In <code className="text-amber-300 font-mono">Product.java</code> and <code className="text-amber-300 font-mono">Purchase.java</code>,
                  the <code className="text-amber-300 font-mono">reduceStock()</code> method is synchronized on the product monitor lock (<code className="text-amber-300 font-mono">synchronized(product)</code>).
                  It first validates that requested quantity &le; current stock. If another thread bought it milliseconds earlier, the stock check fails, and the system safely throws a stock discrepancy response without allowing negative quantities.
                </p>
              </div>

              <div className="p-4 bg-[#161b22] border border-slate-800 rounded-xl space-y-1.5">
                <span className="font-bold text-amber-400 text-sm block">
                  Q2: What is the difference between Aggregation and Composition in your project?
                </span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> In our project, <code className="text-amber-300 font-mono">CartItem</code> has an <em>aggregation</em> relationship with <code className="text-amber-300 font-mono">Product</code>.
                  If a user deletes a <code className="text-amber-300 font-mono">CartItem</code> from their cart, the <code className="text-amber-300 font-mono">Product</code> continues to exist inside the supermarket catalog. By contrast, a composition relationship would destroy the product entity when the cart item is destroyed.
                </p>
              </div>

              <div className="p-4 bg-[#161b22] border border-slate-800 rounded-xl space-y-1.5">
                <span className="font-bold text-amber-400 text-sm block">
                  Q3: How are delivery charges and GST taxes computed?
                </span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> In <code className="text-amber-300 font-mono">Cart.java</code>, we apply a 5% GST tax on the discounted subtotal.
                  Orders equal to or exceeding ₹400 qualify for free home delivery (₹0.00). Orders below ₹400 incur a standard ₹40 delivery fee.
                </p>
              </div>

              <div className="p-4 bg-[#161b22] border border-slate-800 rounded-xl space-y-1.5">
                <span className="font-bold text-amber-400 text-sm block">
                  Q4: Why did you choose the Facade Design Pattern for Supermarket.java?
                </span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> The Facade Pattern provides a simple unified interface for the client and API server, shielding them from the complex internal details of multi-category lookups, inventory filtering, and stock updates.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#161b22] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>Project: <strong>kaadugal</strong> • Developer: <strong>Rajasabari.P</strong> • Copyright: <span className="font-mono text-amber-400">sabari30608@gmail.com</span></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
