function toggleCategories() {
    const CATEGORY_List = document.getElementById('category_list');
    const SELECT_ARROW = document.getElementById('select_arrow');
    CATEGORY_List.classList.toggle('show');
    SELECT_ARROW.classList.toggle('turn');
  }