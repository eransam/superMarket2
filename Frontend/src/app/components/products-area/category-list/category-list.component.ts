import { Unsubscribe } from 'redux';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CategoryModel } from 'src/app/models/category.model';
import { ProductModel } from 'src/app/models/product.model';
import { NotifyService } from 'src/app/services/notify.service';
import { ProductsService } from 'src/app/services/products.service';
import store from 'src/app/redux/store';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, OnDestroy {

// יוצאים משתנים 
  categories: CategoryModel[]
  products: ProductModel[]
  searchText = ''

//   משתנה מסוג פונקציה כדי שלשם אנו נכניס את האזנה לשינויים שלנו ונעשה את הפעולה הזו בתוך המשתנה הזה כדי שנוכל
// בעת הריסת הקומפוננטה גם לבטל את האזנה לשינויים
  unsubscribe: Unsubscribe



  constructor(private productsService: ProductsService, private notify: NotifyService) { }
// תופס אלמנטים מהדום @ViewChild 
//tabGroup ומכניס אותם למשתנה 
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

//  כל הפקודות שבתוך יקרו בעת טעינת הקומפוננטה  =  ngOnInit
  async ngOnInit() {

    try {
// טוענים לוך משתנה זה את כל האובייקטיהקטגוריות הנמצאים בתוך הדאטה בייס
      this.categories = await this.productsService.getAllCategories()

    // פקודה זו של הסטור אומרת לנו בעצם שבכל שינוי אשר קורא בסטור התבצעו הפקודות שבתוכה  store.subscribe
      this.unsubscribe = store.subscribe(() => {

        //searchText שזה אומר שיוכנס ערך חדש ישר מהסטור לתוך המשתנה 
        this.searchText = store.getState().productsState.searchText;

        
        if (this.searchText !== '') {
          //מביא את כל הקטגוריות בלי סינון
          //.selectedIndex = 0 בעזרת הפקודה 
          this.tabGroup.selectedIndex = 0
        }
      })

    } catch (err: any) {
      this.notify.error(err)
      
    }
  
  }

  async selectCategoryByIndex(index: number) {
    try {

        // במידה ויכנס כארגומנט 0 יוצגו כל הקטגוריות
      if (index === 0) {
        this.productsService.setSelectedCategory('all')

        // כך תוצג רק קטגןריה נבחרת ע'יי כך שיכניסו בפונ הראשית את האינדקס של אותה קטגוריה
      } else {
        this.productsService.setSelectedCategory(this.categories[index - 1]._id)
      }

    } catch (err: any) {
      this.notify.error(err)
    }
  }

  //בהריסת הקומפוננטה אנו נהרוס את המשתנה אשר מכיל את ההאזנה לשינויים
  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}
