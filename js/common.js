//Объвление переменных-селекторов-------------------------------------------   
var CList=$(".company-list"), //список компаний
	  DList=$(".division-list"), //список отделов
    CTitle=$(".company-title"), //заголовок выбора компании
    DTitle=$(".division-title"), //заголовок выбора отдела
    Division=$(".division"), //контейнер содержащий список отделов
    Ulist=$(".users-base"),  //таблица с контактами
    Mbutton=$(".menu-button"), //кнопка меню
    Selection=$(".selection"), //блок меню
    selectedCompany='', selectedDivision='', usersSearchvalue='', companySearchvalue='', divisionSearchvalue=''; //критерии отбора, переменные необходимые для поиска
//событие полной загрузки DOM дерева
$(document).ready(function() {
  slideMenu();
  getCompany(companySearchvalue);
  getUsers(selectedCompany, selectedDivision, usersSearchvalue);
  startLoading();
  Search();
  catchDefaultSearch();
  addUsers();
  });


//анимация-------------------------------------------------------------------

/*Раскрывает списки, показывает заголовок меню выбора дивизиона,*/
function slideMenu(){
  CTitle.click(function(event) {
   CList.slideToggle(10);
   Division.css('display', 'block');
 });
  DTitle.click(function(event) {
   DList.slideToggle(10);
 });
  Mbutton.click(function(event) {
    Selection.animate({left: '0px'}, 400);
    $('.menu-button i').css({transform: 'rotate(180deg)'});
    if (Selection.css('left')=='0px'){
      Selection.animate({left: '-412px'}, 400, function(callback){
        $('.menu-button i').css({transform: 'rotate(360deg)'});
        CList.css('display', 'none');
        DList.css('display', 'none');
      });
    }
  });
  $('article').click(function(event) {
    Selection.animate({left: '-412px'}, 400, function(callback){
      $('.menu-button i').css({transform: 'rotate(360deg)'});
      CList.css('display', 'none');
      DList.css('display', 'none');
    });
  });
}
//анимация загрузки
function startLoading(){
  $("#loading").addClass('loading-active');
}
function stopLoading(){
  $("#loading").removeClass('loading-active');
}
//кнопка обновить
$('.refresh-button').click(function(event) {
  $('.refresh-button i').addClass('refresh-button-active');
  setTimeout(function() {$('.refresh-button i').removeClass('refresh-button-active');}, 1500);
  selectedCompany='';
  selectedDivision='';
  startLoading();
  getUsers(selectedCompany, selectedDivision, '');
});
//прилипающий заголовок
$(window).scroll(function(event) {
 if ($(window).scrollTop() > 105) {
  $('.table-company-name').addClass('table-company-name-fixed');
}
else{
  $('.table-company-name').removeClass('table-company-name-fixed');
}
});
//обработчик данных-------------------------------------------------------------

//получить список компаний
/*Получает список компаний из json переменной , генерирует HTML код, осуществляет выборку по клику передает
выбранное значение в переменную selectedCompany для дальнейшей обработки, скроллит страницу вверх*/
function getCompany(srch){
 $.ajax({
  url: "http://localhost:8080/list-company.json?limit=300&search="+srch+"",
  type: "GET",
  dataType: "JSON",
  async: false,
  success: function(json){
    $('.company-list li').empty();
    var company=[];  
    for (var i = 0; i < json.data.length; i++) {
      company[i]= json.data[i];
      CList.append('<li class="list-item"><i>' +company[i]+ '</i><br></li>');
    }
  }
});
 selectCompany();
}
//выбор компании
function selectCompany (){
  $(".company-list i").click(function (event) {
  $(".company ul i").removeClass();
  $(this).addClass('active-list-item');
  selectedCompany=$(this).html();
  CList.css('display', 'none');
  $("body, html").animate({
    scrollTop: 0
  }, 100);
  selectionCheck();
  getDivision(divisionSearchvalue, selectedCompany);
});
}
//получить список отделов
/*Получает список отделов из json переменной , генерирует HTML код, осуществляет выборку по клику передает
выбранное значение в переменную selectedDivision для дальнейшей обработки, скроллит страницу вверх*/
function getDivision(srch, com){
 $.ajax({
  url: "http://localhost:8080/list-division.json?limit=9999&search="+srch+"&company="+com+"",
  type: "GET",
  dataType: "JSON",
  async: false,
  success: function(json){
    $('.division-list li').empty();
    var division=[];  
    for (var i = 0; i < json.data.length; i++) {
      division[i]= json.data[i];
      DList.append('<li class="list-item"><i>' +division[i]+ '</i><br></li>');
    }
  }
});
 selectDivision();
}
//выбор дивизиона компании
function selectDivision(){
  $(".division-list i").click(function(event) {
  $(".division ul i").removeClass();
  $(this).addClass('active-list-item');
  selectedDivision=$(this).html();
  DList.css('display', 'none');
  $("body, html").animate({
    scrollTop: 0
  }, 100);
  selectionCheck();
});
}
//получить список сотрудников
//исходя из полученных данных получает основной контент, генерирует таблицу
function getUsers(com, div, srch){
  var usersUrl="http://localhost:8080/list-person.json?limit=50&company="+com+"&search="+srch+"&division="+div+"";
  var testURL="list-person.json"
  $.ajax({
    url: usersUrl,
    type: "GET",
    dataType: "JSON",
    async: true,
    success: function(json){
      var person=[];
      if (selectedCompany=='' && selectedDivision==''){
        $('.company-description').html('');
        $('.company-description').append('Список сотрудников GAZ Group');
      }
      else{
        $('.company-description').html('');
        $('.company-description').append(com+": "+div);
      }  
      $(".updated-content").empty();
    //формируем список сотрудников
    for (var i = 0; i < json.data.length; i++) {
      person[i]= json.data[i];
      $('.users-base').append('<tr class="updated-content"><td>' +person[i]+ '</td><td>повелитель ситхов N: ' +(i+1)+ '</td><td>example@gaz.ru</td><td>x-xxx-xxx-xx-xx</td></tr>');
    }
    stopLoading();
  }
});
}
//подгрузка списка пользователей
function addUsers(com, div, srch, page){
 $.ajax({
  url: "http://localhost:8080/list-person.json?limit=100&company="+com+"&search="+srch+"&division="+div+"",
  type: "GET",
  dataType: "JSON",
  async: true,
  success: function(json){
    var person=[];
    for (var i = 0; i < json.data.length; i++) {
      person[i]= json.data[i];
      $('.users-base').append('<tr class="updated-content"><td>' +person[i]+ '</td><td>повелитель ситхов N: ' +(i+1)+ '</td><td>example@gaz.ru</td><td>x-xxx-xxx-xx-xx</td></tr>');
    }
    stopLoading();
  }
});
}
//инициировать подгрузку
$(window).scroll(function(event) {
  if($(window).scrollTop()+$(window).height()>=$(document).height()){
    startLoading();
    addUsers(selectedCompany, selectedDivision, usersSearchvalue);
  }
});
  //проверка наличия пременных для отбора, если true сформировать список
  function selectionCheck(){
    if (selectedCompany!=='' || selectedDivision!==''){
      startLoading();
      getUsers(selectedCompany, selectedDivision, '');
    }
  }
 //функции поиска
  //поисковый фильтр для поиска по сотрудникам, компаниям и подразделениям
  function Search(){
    //по людям
    $('.filter2').keyup(function(event) {
      if ((event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode == 32 || event.keyCode == 13 || event.keyCode == 8 
        || (event.keyCode >= 48 && event.keyCode <= 57)){
       usersSearchvalue= $(this).val();
       getUsers(selectedCompany, selectedDivision, usersSearchvalue);
     }
    });
    //по дивизионам
    $('.filter1').keyup(function(event) {
       if ((event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode == 32 || event.keyCode == 13 || event.keyCode == 8 
        || (event.keyCode >= 48 && event.keyCode <= 57)){
      divisionSearchvalue= $(this).val();
      getDivision(divisionSearchvalue);
    }
    });
   //по компаниям
    $('.filter').keyup(function(event) {
       if ((event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode == 32 || event.keyCode == 13 || event.keyCode == 8 
        || (event.keyCode >= 48 && event.keyCode <= 57)){
      companySearchvalue= $(this).val();
      getCompany(companySearchvalue);
    }
    });
  }
//перехват стандартного браузерного поиска.
function catchDefaultSearch(){
  $(window).keydown(function(event) {
    if (event.ctrlKey && event.keyCode==70){
      $('.filter2').focus();
      event.preventDefault();
      var inputPosition= $('.filter2').offset().top;
      $(document).scrollTop(inputPosition - 115);
    }
  });
}
