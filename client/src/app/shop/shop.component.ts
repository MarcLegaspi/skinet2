import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IProductType } from '../shared/models/product-type';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: IProduct[];
  brands: IBrand[];
  productTypes: IProductType[];
  shopParams = new ShopParams();
  sortItems = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' }
  ];
  totalItems: number;
  @ViewChild('search', { static: true }) searchInput:  ElementRef;
  searchText: string;

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getProductTypes();
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams)
      .subscribe(response => {
        this.products = response.data;
        this.totalItems = response.count;
      },
        error => {
          console.log(error);
        });
  }

  getBrands() {
    this.shopService.getBrands()
      .subscribe(response => {
        this.brands = [{ id: 0, name: 'All' }, ...response];
      },
        error => {
          console.log(error);
        });
  }

  getProductTypes() {
    this.shopService.getProductTypes()
      .subscribe(response => {
        this.productTypes = [{ id: 0, name: 'All' }, ...response];
      },
        error => {
          console.log(error);
        });
  }

  onBrandSelected(brandId: any) {
    this.shopParams.brandId = brandId;
    this.getProducts();
  }

  onTypeSelected(typeId: any) {
    this.shopParams.typeId = typeId;
    this.getProducts();
  }

  onSortSelected(sort: any) {
    this.shopParams.sort = sort;
    this.getProducts();
  }

  onPageChanged(event: any) {
    if(this.shopParams.pageIndex !== event) {
      this.shopParams.pageIndex = event;
      this.getProducts();
    }
  }

  onSearch() {
    //const value = this.searchInput.nativeElement.value;
    this.shopParams.search = this.searchText; // value;
    this.getProducts();
  }

  onReset() {
    this.shopParams = new ShopParams();
    this.searchText = '';
    this.getProducts();
  }
}
