import { useProductStore } from "../store/productStore";import {
  useMemo,
  useState,
  useCallback,
  useEffect } from
'react';

import {
  useWebsiteStore } from
'../store/websiteStore';

import {
  useInventoryStore } from
'../store/inventoryStore';


import ProductForm from
'../components/products/ProductForm';

import ProductsStats from
'../components/products/ProductsStats';

import ProductsFilters from
'../components/products/ProductsFilters';

import ProductsGrid from
'../components/products/ProductsGrid';

import ProductsPagination from
'../components/products/ProductsPagination';

import ProductsSkeleton from
'../components/products/ProductsSkeleton';

import ProductSearchInfo from
'../components/products/ProductSearchInfo';

import ProductsSort from
'../components/products/ProductsSort';

import LowStockAlert from
'../components/products/LowStockAlert';

import ProductListCard from
'../components/products/ProductListCard';


import {
  StockEngine } from
'../core';


export default function Products() {


  const products =
  useProductStore(
    (state) => state.products || []
  );


  const addProduct =
  useProductStore(
    (state) => state.addProduct
  );


  const deleteProduct =
  useProductStore(
    (state) => state.deleteProduct
  );


  const toggleProductVisibility =
  useWebsiteStore(
    (state) =>
    state.toggleProductVisibility
  );


  const stockItems =
  useInventoryStore(
    (state) =>
    state.stockItems || []
  );



  const [search, setSearch] =
  useState('');


  const [filter, setFilter] =
  useState('all');


  const [sortBy, setSortBy] =
  useState('newest');


  const [viewMode, setViewMode] =
  useState('grid');


  const [currentPage, setCurrentPage] =
  useState(1);


  const [loading, setLoading] =
  useState(true);



  useEffect(() => {

    const timer =
    setTimeout(
      () => setLoading(false),
      800
    );


    return () => clearTimeout(timer);

  }, []);



  useEffect(() => {

    setCurrentPage(1);

  }, [
  search,
  filter,
  sortBy]
  );




  const handleAddProduct =
  useCallback((product) => {


    addProduct({

      ...product,

      stock:
      product.quantity || 0,

      sold: 0,

      hidden: false

    });


  }, [
  addProduct]
  );




  const handleDelete =
  useCallback((id) => {


    if (
    window.confirm(
      'هل تريد حذف المنتج؟'
    ))
    {

      deleteProduct(id);

    }


  }, [
  deleteProduct]
  );




  const handleUpdateStock =
  useCallback(
    (
    productId,
    quantity) =>
    {


      return StockEngine.setQuantity({

        productId,

        quantity

      });


    },
    []
  );




  const filteredProducts =
  useMemo(() => {


    let result =
    [...products];



    if (search.trim()) {


      result =
      result.filter((product) =>

      product.name?.
      toLowerCase().
      includes(
        search.toLowerCase()
      )

      );

    }




    if (filter === 'low') {

      result =
      result.filter((product) =>

      Number(
        product.stock || 0
      ) <= 5

      );

    }



    if (filter === 'available') {

      result =
      result.filter((product) =>

      Number(
        product.stock || 0
      ) > 0

      );

    }



    if (filter === 'hidden') {

      result =
      result.filter((product) =>

      product.hidden

      );

    }




    const sorters = {

      newest: (a, b) =>

      new Date(
        b.createdAt || 0
      ) -

      new Date(
        a.createdAt || 0
      ),


      oldest: (a, b) =>

      new Date(
        a.createdAt || 0
      ) -

      new Date(
        b.createdAt || 0
      ),


      priceHigh: (a, b) =>

      Number(b.salePrice || b.price || 0) -

      Number(a.salePrice || a.price || 0),


      priceLow: (a, b) =>

      Number(a.salePrice || a.price || 0) -

      Number(b.salePrice || b.price || 0),


      stockHigh: (a, b) =>

      Number(b.stock || 0) -

      Number(a.stock || 0),


      stockLow: (a, b) =>

      Number(a.stock || 0) -

      Number(b.stock || 0)

    };


    if (sorters[sortBy]) {

      result.sort(
        sorters[sortBy]
      );

    }



    return result;


  }, [
  products,
  search,
  filter,
  sortBy]
  );





  const stats = useMemo(() => ({


    totalStock:

    stockItems.reduce(
      (sum, item) =>
      sum +
      Number(item.quantity || 0),
      0
    ),


    totalSold:

    stockItems.reduce(
      (sum, item) =>
      sum +
      Number(item.sold || 0),
      0
    ),


    hiddenProducts:

    products.filter(
      (p) => p.hidden
    ).length,


    lowStockProducts:

    products.filter(
      (p) =>
      Number(p.stock || 0) <= 5
    )


  }), [
  products,
  stockItems]
  );




  const perPage = 6;


  const totalPages =
  Math.ceil(
    filteredProducts.length /
    perPage
  );



  const paginatedProducts =
  filteredProducts.slice(

    (currentPage - 1) * perPage,

    currentPage * perPage

  );




  return (

    <div className="
      p-6
      lg:p-10
      bg-black
      min-h-screen
      text-white
    ">





      


      <div className="
        bg-gradient-to-r
        from-blue-950
        via-blue-700
        to-yellow-500
        rounded-[40px]
        p-8
        mb-12
      ">







        

        <h1 className="
          text-5xl
          font-black
        ">


          

          إدارة المنتجات والمخزون

        </h1>

      </div>



      <ProductsStats

        productsCount={
        products.length
        }

        totalStock={
        stats.totalStock
        }

        totalSold={
        stats.totalSold
        }

        hiddenProducts={
        stats.hiddenProducts
        } />

      



      <ProductForm

        onAddProduct={
        handleAddProduct
        } />

      



      <LowStockAlert

        lowStockProducts={
        stats.lowStockProducts
        } />

      



      <ProductsFilters

        search={search}

        setSearch={setSearch}

        filter={filter}

        setFilter={setFilter} />

      



      <ProductSearchInfo

        totalResults={
        filteredProducts.length
        }

        search={search}

        filter={filter} />

      



      <ProductsSort

        sortBy={sortBy}

        setSortBy={setSortBy} />

      



      {
      loading ?

      <ProductsSkeleton /> :



      viewMode === 'grid' ?

      <ProductsGrid

        products={
        paginatedProducts
        }

        onDelete={
        handleDelete
        }

        onToggleVisibility={
        toggleProductVisibility
        }

        onUpdateStock={
        handleUpdateStock
        } /> :





      <div className="space-y-8">

          {
        paginatedProducts.map((product) =>

        <ProductListCard

          key={product.id}

          product={product}

          onDelete={
          handleDelete
          }

          onToggleVisibility={
          toggleProductVisibility
          }

          onUpdateStock={
          handleUpdateStock
          } />



        )
        }

        </div>

      }




      {
      totalPages > 1 &&

      <ProductsPagination

        currentPage={
        currentPage
        }

        totalPages={
        totalPages
        }

        onPageChange={
        setCurrentPage
        } />



      }


    </div>);



}