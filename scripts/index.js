///////// чистые функции
// регулярки
var filters = {
  phone: /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/,
  email: /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
  name: /[^0-9]+$/
}

// ошибки
var Errors = {
  'field-firstname': 'неверно указанно имя',
  'field-lastname': 'неверно указанна фамилия',
  'field-tel': 'неверно указан телефон',
  'field-email': 'неверно указан email'
}
// типы полей по id
var validTypes = {
  'field-firstname': filters.name,
  'field-lastname': filters.name,
  'field-tel': filters.phone,
  'field-email': filters.email
}

// данные таблицы

var tdata = [
  [1,"$5 321","123 456 000","ru" , true ],
  [2,"$3 000","425 238 238","es" , true ],
  [3,"$890","212 552 112","cn" , true ],
  [4,"$777","123 543 548","ru"  ],
  [5,"$666","090 235 453","es"  ],
  [6,"$555","009 281 443","cn"  ],
  [7,"$444","515 654 522","ru"  ],
  [8,"$333","765 452 241","es"  ],
  [9,"$222","562 183 816","cn"  ],
  [10,"$111","642 452 555","ru"  ]
];

// фильтры сортировки

var sortfilters = {
  index: 0,
  deposit: 0,
  acNumber: 0,
  country: 0
}
/*
  на вход функции скармливаем лист:
  {id элемента : регулярка}
  на выходе получаем массив из тех, кто не прошел проверку
*/
function validate(ids){
  var result = [];
  for(var i in ids){
    var value = !document.getElementById(i) ? console.error( "нет такого элемента "+i): document.getElementById(i).value;
    if(! validTypes[i].test(value) ){
      result.push(i)
    }
  } return result;
}
///////// код документа
/*
  при загрузке документа
*/
document.addEventListener("DOMContentLoaded", function() {

  // загрузка последнего действия из локального хранилища
  if(localStorage && localStorage.filter){
    sortArray( localStorage.value , localStorage.filter);
  }

  // рендерим таблицу
  renderTable(tdata)

  document.body.querySelectorAll('.filter').forEach(function(el){
    el.addEventListener('click', function(e){

      sortfilters[this.id] = sortfilters[this.id]==1?-1:1;

      // сохранение последнего действия в локальное хранилище
      if(localStorage){
        localStorage.setItem('filter', this.id)
        localStorage.setItem('value',  sortfilters[this.id])
      }

      sortArray( sortfilters[this.id] , this.id);
      renderTable(tdata)
    }, false)
  })
  document.body.querySelectorAll('input').forEach(function(e) {
    e.onblur = function(){
      if(this.value){
        validate({[this.id]: validTypes[this.id]}).length ?
          errorMessage(this.id) :
          noErrorMessage(this.id);
      }
    }
    document.getElementById('regForm').onsubmit  = function(e){
      e.preventDefault();
      if(validate(validTypes).length){
        var ers = validate(validTypes);
        for(var i=0;i<ers.length;i++){
          errorMessage(ers[i])
        }
      }else{
        var submit = document.getElementById("field-submit");
        submit.disabled;
        submit.value = 'загрузка...';
        submit.style.background = '#ccc';
        submit.style['border-color'] = '#ccc';

        setTimeout(function() {
            document.getElementById('regForm').innerHTML = '<h4 style="width: 100%;height:200px;background: rgba(255,255,255,.3);font-size:3em;border-radius:.2em;line-height:200px"><nobr>Регистрация прошла успешно!</nobr></h4>';
         }, 2000);
      }
    }
  })
});

////// вспомогательные функции
function errorMessage(id) {
    var el = document.getElementById(id);
    el.ownPlaceholder = el.placeholder;
    el.placeholder = Errors[id];
    el.style.background = 'MistyRose';
}
function noErrorMessage(id) {
    var el = document.getElementById(id);
    el.ownPlaceholder ? el.placeholder = el.ownPlaceholder : null;
    el.style.background = 'white';
}

function sortArray( n , p){
  if(p == 'index' ){
    // сортировка по #
    tdata.sort(function(a,b){
      return b[0] > a[0]?-n:n;
    })
  }else if(p=='deposit'){
     // сортировка по депозиту
    tdata.sort(function(a,b){
      return  parseInt(a[1].replace(/\s/g,'').slice(1)) > parseInt(b[1].replace(/\s/g,'').slice(1))?-n:n;
    })
  }else if(p=='acNumber'){
    // сортировка по номеру счета
    tdata.sort(function(a,b){
      return parseInt(a[2].replace(/\s/g,'')) > parseInt(b[2].replace(/\s/g,''))?-n:n;
    })
  }else if(p=='country'){
    tdata.sort(function(a,b){
      return a[3] > b[3]?-n:n;
    })
  }
}
// функции для рендера таблицы
function renderTable(data){
  var tbody = document.getElementById('tbody');
  tbody.innerHTML = '';
  for(var i in data){
    tbody.innerHTML += `<tr ${tdata[i][4]===true?'class="orangeRow"':''}>
                    <td><span>${tdata[i][0]}</span></td>
                    <td><span>${tdata[i][1]}</span></td>
                    <td><span>${tdata[i][2]}</span></td>
                    <td class="${'flag '+{ru:'Rus',es:'Es',cn:'Cn'}[tdata[i][3]]}"></td>
                    </tr>`
  }
}
