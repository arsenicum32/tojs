"use strict";
function validatePhone(id) {
    let phone = document.getElementById(id).value;
    let filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
    if (filter.test(phone)) {
        noErrorMessage(id);
        return true;
    } else {
        errorMessage(id);
        return false;
    }
}

function validateAlphabetsOnly(id) {
    let regex = new RegExp(/[^0-9]+$/);
    let str = document.getElementById(id).value;
    if (regex.test(str)) {
        noErrorMessage(id)
        return true;
    } else {
        errorMessage(id);
        return false;
    }
}

function validateEmail(id) {
    let email = document.getElementById(id).value;
    let regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (regex.test(email)) {
        noErrorMessage(id)
        return true;
    } else {
        errorMessage(id);
        return false;
    }
}

function errorMessage(id) {

    $("span." + id + ".error").show();
    // тут надо бы добвлять элемент с текстом ошибки что бы его не надо было псать в html формы но тогда надо делать массив сообщений и т.д. если будет время НАПИШИ
  }

function noErrorMessage(id) {
    $("span." + id + ".error").hide();
}

function validateAll() {
    let a = validatePhone("field-tel");
    let b = validateAlphabetsOnly("field-lastname");
    let c = validateAlphabetsOnly("field-firstname");
    let d = validateEmail("field-email");
    if (a && b && c && d) {
        return true;
    } else
        return false;
}

function flags() {
  //можно проще, через css по атрибуту data-country прописать стили. Но для этого придет и сам атрибут прописать
    $('td:contains("ru")').addClass('flag Rus');
    $('td:contains("cn")').addClass('flag Cn');
    $('td:contains("es")').addClass('flag Es');
}


function sortTable(key, sortDirection) {
  let  $thElem = $("th[data-key='" + key + "'] ");
    let thIndex = $thElem.index() + 1;
    let sortingTable = $thElem.closest('table').find('tbody tr');
    let sortType = $thElem.data('type');
      if (sortDirection === undefined) {
         sortDirection = $thElem.data('direction');
        }
    saveSort (key, sortDirection);
    sortDirection = (sortDirection == 'up') ? 'down' : 'up';
    $thElem.find('span').toggleClass("up");
    $thElem.data('direction', sortDirection);
    let objects = [];
    $(sortingTable).each(function() {
        let value = $(this).find('td:nth-child(' + thIndex + ')').text();
        let item = $(this);
        objects.push({
            value: value,
            item: item
        });
    });
    if (sortType == "number") {
        objects.sort(function(obj1, obj2) {
                return (parseFloat(obj1.value.replace(/[^\d.]/ig, '')) - parseFloat(obj2.value.replace(/[^\d.]/ig, '')));
        });
    } 
    else {
        objects.sort(function(obj1, obj2) {
                return obj1.value.localeCompare(obj2.value);
        });
    }

   objects = (sortDirection == 'down') ? objects.reverse() : objects;
   $('table tbody tr').remove();
     let deposites = [];
    $.each(objects, function(index, item) {

        deposites[index] = item.item.find('td:nth-child(2)').text();

        if (item.item) {
            item.item.find('td:nth-child(' + thIndex + ')').html("<span>" + item.value + "</span>");
            $('#grid').append('<tr >' + item.item.html() + '</tr>');
        }
    });    
    deposites.sort(function(a, b) {
        return parseInt( parseInt(b.replace(/[^\d.]/ig, '')- a.replace(/[^\d.]/ig, '')) );
      });
    for (let i=0; i<3; i++)
    {
      $("tr td:contains('"+deposites[i] +"')").parent("tr").addClass('orangeRow');
    }
    flags(); 
}




$("#grid thead th").click(function() {
    sortTable($(this).data("key"));
  });

$("#grid").ready(function () {
  loadSort();
  flags();
});


$(document).ready(function() {   
    $("input").blur(function() {
        if ($(this).attr("name") == "tel")
            validatePhone($(this).attr("id"));
        if ($(this).attr("name") == "firstname" || $(this).attr("name") == "lastname")
            validateAlphabetsOnly($(this).attr("id"));
        if ($(this).attr("name") == "email")
            validateEmail($(this).attr("id"));
    });
    $("#regForm").submit(function(event) {

            $("#field-submit").attr('disabled', 'disabled');
            if (validateAll()) {

                event.preventDefault();
                $(".loader-wrapper").show();

                setTimeout(function() {
                    alert('Регистрация прошла успешно');
                    $(".loader-wrapper").hide();
                }, 2000);

            }
            return false;
        });
    });


function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
} catch (e) {
    return false;
  }
}
function loadSort() {
    if (!supportsLocalStorage()) { return false; }
      var retSortedBy =    JSON.parse(localStorage.getItem("tableSortedBy"));
    if (!retSortedBy) { return false; }
      console.log (retSortedBy.key);
       sortTable(retSortedBy.key, retSortedBy.isAscending);
     
}
function saveSort (key, sortDirection)
{
    if (!supportsLocalStorage()) { return false; }
    let sortedBy = { key: key,  isAscending: sortDirection};
    let serialSortedBy = JSON.stringify(sortedBy);
  localStorage.setItem("tableSortedBy" ,serialSortedBy);
}