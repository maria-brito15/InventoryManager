/* Necessary imports for React and components */
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import addIcon from './img/add.svg';
import trashIcon from './img/trash.svg';
import updIcon from './img/upd.svg';
import filterIcon from './img/filter.svg';
import './App.css';

function App() {
  /* States to manage products and loading */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  /* States to control modal visibility */
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  /* States to control modal closing animations */
  const [closingAddModal, setClosingAddModal] = useState(false);
  const [closingDeleteModal, setClosingDeleteModal] = useState(false);
  const [closingUpdateModal, setClosingUpdateModal] = useState(false);

  /* State to store new product data */
  const [newProduct, setNewProduct] = useState({ name: '', price: '', quantity: '' });

  /* States to manage product deletion */
  const [deleteProductId, setDeleteProductId] = useState('');
  const productToDelete = products.find(p => p.id.toString() === deleteProductId);

  /* States to manage product updates */
  const [updateProductId, setUpdateProductId] = useState('');
  const [updateFields, setUpdateFields] = useState({ name: false, price: false, quantity: false });
  const [updateValues, setUpdateValues] = useState({ name: '', price: '', quantity: '' });
  const productToUpdate = products.find(p => p.id.toString() === updateProductId);

  /* Effect to load products when component mounts */
  useEffect(() => {
    fetchAllProducts();
  }, []);

  /* Effect to update values when product to update changes */
  useEffect(() => {
    if (productToUpdate) {
      setUpdateValues({
        name: productToUpdate.name,
        price: productToUpdate.price,
        quantity: productToUpdate.quantity
      });
    }
  }, [productToUpdate]);

  /* Function to fetch all products from API */
  async function fetchAllProducts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8080/products');
      if (!res.ok) throw new Error('Erro ao Buscar Produtos: ', error);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* Function to handle search by ID or name */
  async function handleSearch() {
    const term = (searchTerm || '').trim();

    /* If term is empty, fetch all products */
    if (term === '') {
      fetchAllProducts();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let url = '';

      /* Check if term is a number (ID) */
      if (/^\d+$/.test(searchTerm.trim())) {
        url = `http://localhost:8080/products/${searchTerm.trim()}`;
        const res = await fetch(url);

        if (res.status === 404) {
          setProducts([]);
          setError('Produto não Encontrado');
        } else if (!res.ok) {
          throw new Error('Erro ao Buscar Produto por ID');
        } else {
          const data = await res.json();
          setProducts([data]);
        }
      } else {
        /* Search by name */
        url = `http://localhost:8080/products/search?name=${encodeURIComponent(searchTerm.trim())}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Erro ao Buscar Produtos por Nome: ', error);
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  /* Function to add new product */
  async function addProduct(newProduct) {
    try {
      const res = await fetch('http://localhost:8080/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (!res.ok) throw new Error('Erro ao Adicionar Produto');

      await fetchAllProducts();
      handleCloseAddModal();
    } catch (err) {
      alert(err.message);
    }
  }
  
  /* Function to delete product */
  async function deleteProduct(id) {
    try {
      const res = await fetch(`http://localhost:8080/products/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Erro ao Excluir Produto');

      await fetchAllProducts();
      handleCloseDeleteModal();
    } catch (err) {
      alert(err.message);
    }
  }

  /* Function to update product */
  async function updateProduct(id, updatedFields) {
    try {
      const res = await fetch(`http://localhost:8080/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });

      if (!res.ok) throw new Error('Erro ao Atualizar Produto');

      await fetchAllProducts();
      handleCloseUpdateModal();
    } catch (err) {
      alert(err.message);
    }
  }

  /* Function to toggle update fields */
  function toggleField(field) {
    setUpdateFields(prev => {
      // Copy previous fields and toggle the specified field
      const newFields = { ...prev, [field]: !prev[field] };

    // If the field was just turned off and product data exists,
    // reset the updateValues for that field to the original product value
      if (!newFields[field] && productToUpdate) {
        setUpdateValues(prevValues => ({
          ...prevValues,
          [field]: productToUpdate[field]
        }));
      }

      return newFields;
    });
  }

  /* Function to close add modal with animation */
  function handleCloseAddModal() {
    setClosingAddModal(true);
    setTimeout(() => {
      setShowAddModal(false);
      setClosingAddModal(false);
    }, 400);
  }

  /* Function to close delete modal with animation */
  function handleCloseDeleteModal() {
    setClosingDeleteModal(true);
    setTimeout(() => {
      setShowDeleteModal(false);
      setClosingDeleteModal(false);
    }, 400);
  }

  /* Function to close update modal with animation */
  function handleCloseUpdateModal() {
    setClosingUpdateModal(true);
    setTimeout(() => {
      setShowUpdateModal(false);
      setClosingUpdateModal(false);
    }, 400);
  }

  /* State to control ordering */
  const [ordered, setOrdered] = useState(false);

  /* Function to fetch products ordered by quantity */
  const fetchProductsOrderedByQuantity = async () => {
    try {
      const response = await fetch("http://localhost:8080/products/ordered-by-quantity");
      if (!response.ok) {
        throw new Error("Erro ao Buscar Produtos Ordenados");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setError("Erro ao Buscar Produtos Ordenados");
    }
  };

  /* Function to toggle between normal order and by quantity */
  const toggleOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!ordered) {
        fetchProductsOrderedByQuantity();
      } else {
        fetchAllProducts();
      }

      setOrdered(!ordered);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* Component rendering */
  return (
    <>
      {/* Backdrop blur for modals */}
      {(showAddModal || showDeleteModal || showUpdateModal) && (
        <div className="modal-backdrop-blur"></div>
      )}

      <div className="container mt-5 w-75">
        <h1 className="text-center mb-4">Produtos do Estoque</h1>

        {/* Search section and action buttons */}
        <div className="mb-3 d-flex justify-content-center w-100">
          <input
            type="text"
            placeholder="Buscar por ID ou Nome"
            className="form-control me-2"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
          />

          <div className='d-flex gap-2'>
            <button className="btn btn-primary fw-semibold" onClick={handleSearch}>
              Buscar
            </button>

            <button className="btn pb-2 bg-success" onClick={() => setShowAddModal(true)}>
              <img src={addIcon} alt="Adicionar" width="22px" />
            </button>

            <button className="btn pb-2 bg-danger" onClick={() => setShowDeleteModal(true)}>
              <img src={trashIcon} alt="Excluir" width="22px" />
            </button>

            <button className="btn pb-2 bg-warning" onClick={() => setShowUpdateModal(true)}>
              <img src={updIcon} alt="Atualizar" width="22px" />
            </button>

            <button className="btn pb-2 bg-secondary" onClick={toggleOrder}>
              <img src={filterIcon} alt="Reorganizar" width="22px" />
            </button>
          </div>
        </div>

        {/* Conditional rendering based on loading state */}
        {loading ? (
          <p className="text-center">Carregando Produtos...</p>
        ) : error ? (
          <p className="text-center text-danger">Erro: {error}</p>
        ) : (
          /* Products table */
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr className='text-center'>
                <th>ID</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>R$ {p.price.toFixed(2)}</td>
                  <td>{p.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for adding product */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content shadow ${closingAddModal ? 'fade-out' : ''}`}>
              <div className="modal-header">
                <h5 className="modal-title">Adicionar Produto</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseAddModal}
                />
              </div>
              <div className="modal-body">
                <p>Aqui Você Pode Adicionar um Produto.</p>
                <div className='d-flex flex-column gap-2'>
                  <input
                    className='form-control'
                    type='text'
                    placeholder='Nome'
                    value={newProduct.name}
                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                  <input
                    className='form-control'
                    type='number'
                    placeholder='Preço'
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                  <input
                    className='form-control'
                    type='number'
                    placeholder='Quantidade'
                    value={newProduct.quantity}
                    onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  />
                </div>
                <button
                  className='bg-success btn mt-3 text-white w-100 fw-semibold'
                  onClick={() =>
                    addProduct({
                      name: newProduct.name,
                      price: parseFloat(newProduct.price),
                      quantity: parseInt(newProduct.quantity)
                    })
                  }
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for deleting product */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content shadow ${closingDeleteModal ? 'fade-out' : ''}`}>
              <div className="modal-header">
                <h5 className="modal-title">Excluir Produto</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDeleteModal}
                />
              </div>
              <div className="modal-body">
                <p>Tem Certeza que Deseja Excluir um Produto?</p>
                <div className='d-flex flex-column gap-2'>
                  <input
                    className='form-control'
                    type='number'
                    placeholder='ID do Produto'
                    value={deleteProductId}
                    onChange={e => setDeleteProductId(e.target.value)}
                  />
                </div>

                {/* Preview of product to be deleted */}
                {productToDelete ? (
                  <div className="mt-3 ps-2 pt-2 border rounded bg-light d-flex flex-column product-preview">
                    <p><strong>ID: </strong>{productToDelete.id}</p>
                    <p><strong>Nome: </strong>{productToDelete.name}</p>
                    <p><strong>Preço: </strong>{productToDelete.price}</p>
                    <p><strong>Quantidade: </strong>{productToDelete.quantity}</p>
                  </div>
                ) : deleteProductId.trim() !== '' ? (
                  <p className="text-danger mt-4">Produto não Encontrado</p>
                ) : null}

                <button
                  className='bg-danger btn mt-3 text-white w-100 fw-semibold'
                  onClick={() => deleteProduct(deleteProductId)}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for updating product */}
      {showUpdateModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className={`modal-content shadow ${closingUpdateModal ? 'fade-out' : ''}`}>
              <div className="modal-header">
                <h5 className="modal-title">Atualizar Produto</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseUpdateModal}
                />
              </div>
              <div className="modal-body">
                <p>O que Você Deseja Atualizar?</p>

                {/* ID section and checkboxes for fields */}
                <div className='d-flex gap-3 align-items-center justify-content-center mb-3'>
                  <div className='flex-grow-1'>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="ID do Produto"
                      value={updateProductId}
                      onChange={e => setUpdateProductId(e.target.value)}
                    />
                  </div>

                  <div className="d-flex gap-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="updateName"
                        checked={updateFields.name}
                        onChange={() => toggleField('name')}
                        className="form-check-input"
                      />
                      <label htmlFor="updateName" className="form-check-label">Nome</label>
                    </div>

                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="updatePrice"
                        checked={updateFields.price}
                        onChange={() => toggleField('price')}
                        className="form-check-input"
                      />
                      <label htmlFor="updatePrice" className="form-check-label">Preço</label>
                    </div>

                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="updateQuantity"
                        checked={updateFields.quantity}
                        onChange={() => toggleField('quantity')}
                        className="form-check-input"
                      />
                      <label htmlFor="updateQuantity" className="form-check-label">Quantidade</label>
                    </div>
                  </div>
                </div>

                {/* Conditional inputs based on selected fields */}
                {updateFields.name && (
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Novo Nome"
                    value={updateValues.name}
                    onChange={e => setUpdateValues(prev => ({ ...prev, name: e.target.value }))}
                  />
                )}

                {updateFields.price && (
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Novo Preço"
                    value={updateValues.price}
                    onChange={e => setUpdateValues(prev => ({ ...prev, price: e.target.value }))}
                  />
                )}

                {updateFields.quantity && (
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Nova Quantidade"
                    value={updateValues.quantity}
                    onChange={e => setUpdateValues(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                )}

                {/* Tabelas de comparação antes/depois da atualização */}
                {productToUpdate && (
                  <div className="row mt-4">
                    <div className="col-md-6">
                      <h6>Informações Atuais</h6>
                      <table className="table table-bordered">
                        <tbody>
                          <tr><th>ID</th><td>{productToUpdate.id}</td></tr>
                          <tr><th>Nome</th><td>{productToUpdate.name}</td></tr>
                          <tr><th>Preço</th><td>{productToUpdate.price}</td></tr>
                          <tr><th>Quantidade</th><td>{productToUpdate.quantity}</td></tr>
                        </tbody>
                      </table> 
                    </div>
                    <div className="col-md-6">
                      <h6>Novas Informações</h6>
                      <table className="table table-bordered">
                        <tbody>
                          <tr><th>ID</th><td>{productToUpdate.id}</td></tr>
                          <tr><th>Nome</th><td>{updateFields.name ? updateValues.name : productToUpdate.name}</td></tr>
                          <tr><th>Preço</th><td>{updateFields.price ? updateValues.price : productToUpdate.price}</td></tr>
                          <tr><th>Quantidade</th><td>{updateFields.quantity ? updateValues.quantity : productToUpdate.quantity}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <button
                  className="bg-warning btn mt-3 w-100 fw-semibold"
                  onClick={() =>
                    updateProduct(updateProductId, {
                      ...(updateFields.name && { name: updateValues.name }),
                      ...(updateFields.price && { price: parseFloat(updateValues.price) }),
                      ...(updateFields.quantity && { quantity: parseInt(updateValues.quantity) })
                    })
                  }
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer fixo */}
      <footer
        className="bg-light py-3 mt-5 text-center"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          zIndex: 1030,
        }}
      >
        <p className="mb-0 fw-semibold" style={{ fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} Gerenciador de Estoque | Inventory Management - Maria Eduarda P. Brito
        </p>
        <p className="mb-0 mt-1" style={{ fontSize: '0.8rem' }}>
          Projeto desenvolvido com propósitos de aprendizado em Banco de Dados (PostgreSQL), desenvolvimento de API com Java e Spring Boot, e Front-End com React.
        </p>
      </footer>
    </>
  );
}

export default App;