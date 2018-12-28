//Объвление переменных-селекторов-------------------------------------------   
    var CContainer=$(".company-container"); //контейнер списка компаний
    var CList=$(".company-list"); //список компаний
	  var DList=$(".division-list"); //список отделов
    var CTitle=$(".company-title"); //заголовок выбора компании
    var DTitle=$(".division-title"); //заголовок выбора отдела
    var Division=$(".division"); //контейнер содержащий список отделов
    var Ulist=$(".users-base");  //таблица с контактами
    var selectedComapny='', selectedDivision=''; //критерии отбора, переменные формирующие список getUsers
//анимация-------------------------------------------------------------------
//вывод раскрывающегося списка
/*Раскрывакет списки, показывает заголовок меню выбора дивизиона,*/
function slide(){
    CTitle.click(function(event) {
      CContainer.slideToggle(10);
      getCompany();
    });
    DTitle.click(function(event) {
    	DList.slideToggle(10);
    });
}
//поиковый фильтр
/*Подключает плагин фильтра списка, проверяет заполненность поля ввода для IE*/
function searchFilter(){  
  CList.liveFilter('basic');
  DList.liveFilter1('basic'); //Livefilter фильтр для меню выборки
  Ulist.liveFilter2('basic');
  $(".filter").click(function(event) {  //Проверка поля input-по компаниям на заполненность
  if (this.value==""){
  $(".company li").css('display', 'block');
    }
  });
  $(".filter1").click(function(event) {  //Проверка поля input-по отделам на заполненность
  if (this.value==""){
  $(".division li").css('display', 'block');
    }
  });
 }
//Кнопка "Наверх"
	$("#upButton").click(function () {
		$("body, html").animate({
			scrollTop: 0
		}, 800);
		return false;
	});  
  $(".table-company-name").click(function () {
    $("body, html").animate({
      scrollTop: 0
    }, 800);
    return false;
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
//анимация загрузки
function startLoading(){
$("#loading").addClass('loading-active');
}
function stopLoading(){
$("#loading").removeClass('loading-active');
}
//обработчик данных-------------------------------------------------------------
var companySelect=getCompany(), divisionSelect=getDivision();
//получить список компаний
/*Получает список компаний из json переменной , генерирует HTML код, осуществляет выборку по клику передает
 выбранное значение в переменную selectedCompany для дальнейшей обработки, скроллит страницу вверх*/
function getCompany(){
 $.ajax({
    url: "list-company.json",
    type: "GET",
    dataType: "JSON",
    async: true,
    success: function(json){
    var company=[];  
    for (var i = 0; i < json.data.length; i++) {
    company[i]= json.data[i];
    CList.append('<li class="list-item"><i>' +company[i]+ '</i><br></li>');
    }
  }
    });
 //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   $(".company-list i").click(function (event) {
    $(".company ul i").removeClass(); 
    $(this).addClass('active-list-item');
    selectedComapny=$(this).html();
    CList.css('display', 'none');
    $("body, html").animate({
      scrollTop: 0
    }, 100);
    return false;
  });
}
//получить список отделов
/*Получает список отделов из json переменной , генерирует HTML код, осуществляет выборку по клику передает
 выбранное значение в переменную selectedDivision для дальнейшей обработки, скроллит страницу вверх*/
function getDivision(){
   $.ajax({
    url: "list-division.json",
    type: "GET",
    dataType: "JSON",
    async: false,
    success: function(json){
    var division=[];  
    for (var i = 0; i < json.data.length; i++) {
    division[i]= json.data[i];
    DList.append('<li class="list-item"><i>' +division[i]+ '</i><br></li>');
    }
  }
    });
    $(".division-list i").click(function(event) {
    $(".division ul i").removeClass();
    $(this).addClass('active-list-item');
    selectedDivision=$(this).html();
    DList.css('display', 'none');
      $("body, html").animate({
      scrollTop: 0
    }, 100);
    return false;
  });
}
//получить список сотрудников
//исходя из полученных данных получает основной контент, генерирует таблицу
function getUsers(com, div){
    $.ajax({
    url: "list-person.json?company="+com+"&division="+div+"",
    type: "GET",
    dataType: "JSON",
    async: true,
    success: function(json){
    var person=[];
    $('.table-company-name td').html('');
    $('.table-company-name td').append(com);  
    for (var i = 13; i < 100; i++) {
    person[i]= json.data[i];
    $('.users-base').append('<tr class="updated-content"><td>' +person[i]+ '</td><td>повелитель ситхов N: ' +(i-12)+ '</td><td>example@gaz.ru</td><td>x-xxx-xxx-xx-xx</td></tr>');
    }
    stopLoading();
  }
    });
}
  //проверка наличия пременных для отбора, если true сформировать список
$(".list-item i").click(function(event) {
    if (selectedComapny!==''){
    startLoading();
    getUsers(selectedComapny, selectedDivision);
    }
   
});
//событе полной загрузки DOM дерева
  $(document).ready(function() {
  slide();
  getCompany();
  getDivision();
  searchFilter();
  $("footer a").click(function(event) {
    //startLoading();
    //alert(selectedComapny+ "\n" +selectedDivision);
  });
});
