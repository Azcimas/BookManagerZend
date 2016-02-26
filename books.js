$(document).ready(function () {
    /*
     * Wywołanie funkcji, która wyświetla mulit-select menu z autorami
     */
    $('#my-select').multiSelect();
    $('#EditBook').hide();

    /*
     * Dodanie książki.
     */
    $("#SubmitBook").click(function (e) {
        e.preventDefault();
        /*
         * Sprawdzenie czy wpisano wartosci i czy są one zgodne.
         */
        if ($("#titleText").val() === '' || $("#yearText").val() === '') {
            alert("Wpisz wszystkie wartosci!");
            return false;
        }
        if (!$.isNumeric($('#yearText').val()) || $("#yearText").val().length !== 4
                || $("#yearText").val() < 1 || Math.round($("#yearText").val()) === $("#yearText").val()) {
            alert("JS Error");
            return false;
        }

        /*
         * Przechwycenie i wpisanie do arraya elementow(autorów) z multi-selecta
         * i tych wpisanych ręcznie.
         */
        var foo = [];
        $('#my-select :selected').each(function (i, selected) {
            foo[i] = $(selected).text();
        });
        var authors_string = $("#authorText").val().trim();
        var typed_array = authors_string.split(',');
        for (var i = typed_array.length; i--; ) {
            if (typed_array[i] === '') {
                typed_array.splice(i, 1);
            }

        }
        var authors_array = typed_array.concat(foo);

        /*
         * Przekazanie Ajaxem elementów do controllera książek.
         */
        var arr = {
            titleText: $("#titleText").val().trim(),
            yearText: $("#yearText").val()
        };
        jQuery.ajax({
            url: "/ajax/default/indexbooks/addbook",
            data: arr,
            success: function (ans) {
                console.log(ans);
                /*
                 * Sprawdznie czy nie ma PHP Error - związany z wpisaniem
                 * poprawnych danych.
                 */
                if (ans.books.Error) {
                    alert(ans.books.Error);
                    $("#titleText").val('');
                    $("#yearText").val('');
                    $("#authorText").val('');
                    /*
                     * Jeśli dane są poprawne, zachowa wartości zwrócone i przekarze
                     * Ajaxem dane do controllera autorów.
                     */
                } else {
                    var book_title = ans.books.Title;
                    var book_year = ans.books.Year;
                    var book_id = ans.books.Id;
                    var arr2 = {
                        authorText: authors_array,
                        Id: book_id
                    };
                    jQuery.ajax({
                        url: "/ajax/default/indexauthors/addauthor2",
                        data: arr2,
                        success: function (ans2) {
                            console.log(ans2);
                            /*
                             * Wyprintowanie w postaci html nowo stworzonego
                             * wiersza tabeli.
                             */
                            var html = '<tr id="item_' + book_id + '"><td>' +
                                    '<div class="del_wrapper" align="center">\n\
                                    <a href="#" class="del_button" id="del-' + book_id + '">' +
                                    '<img src="styles/images/icon_del.gif" border="0" /></td><td>' +
                                    '</a></div>' +
                                    '<div class="del_wrapper" align="center">\n\
                                    <a href="#" class="edit_button" id="del-' + book_id + '">' +
                                    '<img src="styles/images/editicon.png" border="0" /></a></div>' +
                                    '</td><td>' +
                                    book_id + '</td><td> ' +
                                    book_title + '</td><td> ' +
                                    book_year + '</td><td> ' +
                                    ans2.authors.Authors + '</td></tr>';
                            $("#responds").append(html);
                            $("#titleText").val('');
                            $("#yearText").val('');
                            $("#authorText").val('');

                        }
                    });
                }
            }

        });
    });
    /*
     * Usunięcie książki.
     */
    $("body").on("click", "#responds .del_button", function (e) {
        e.preventDefault();
        /*
         * Walidacja czy użytkownik jest pewny usunięcia.
         */
        if (confirm('Czy na pewno chcesz usunąć pozycję?')) {
            /*
             * Wczytanie id usuwanego elementu.
             */
            var clickedID = this.id.split('-');
            var Db_ID = clickedID[1];
            var arr = {
                authorToDelete: Db_ID
            };
            /*
             * Przekazanie danych do controllera książek.
             */
            jQuery.ajax({
                url: "/ajax/default/indexbooks/deletebook",
                data: arr,
                success: function () {
                    $('#item_' + Db_ID).fadeOut();
                }
            });
        }
    });
    /*
     * Edycja książki
     */
    $("body").on("click", "#responds .edit_button", function (e) {
        e.preventDefault();
        $("#Db_ID").remove();
        /*
         * Zmiana submita,pól do wpisywanie wartości i wyświetlanego tekstu 
         * z dodawnie ksiazki na edycja.
         */
        $("#addbook").html('BOOK EDITION:');
        $("#SubmitBook").hide();
        $("#EditBook").show();
        /*
         * Wczytanie id usuwanego elementu.
         */
        var clickedID = this.id.split('-');
        var Db_ID = clickedID[1];

        var x = $('tr#item_' + Db_ID + ' td:nth-child(4)').html();
        $("#titleText").val(x);
        /*
         * Wykomentowane pozycje są wariantem z promptami tj. nie zmieniamy
         * pól tylko używamy okienek do wpisanie wartości + walidacja.
         */
//        var titleEdit = prompt("Edycja - Tytuł Ksiązki", x);
//        if (titleEdit === null) {
//            return;
//        } else {
//            while (titleEdit === '') {
//                alert("Wpisz wartosc!");
//                var titleEdit = prompt("Edycja - Tytuł Ksiązki");
//            }
//        }
        var y = $('tr#item_' + Db_ID + ' td:nth-child(5)').html();
        $("#yearText").val(y);
//        var yearEdit = prompt("Edycja - Rok wydania Ksiązki", y);
//        if (yearEdit === null) {
//            return;
//        } else {
//            while (!$.isNumeric(yearEdit) || yearEdit.length !== 4
//                    || yearEdit < 1 || Math.round(yearEdit) === yearEdit) {
//                alert("Wpisz wartosc!");
//                var yearEdit = prompt("Edycja - Rok wydania Ksiązki");
//            }
//        }
        var z = $('tr#item_' + Db_ID + ' td:nth-child(6)').html();
        $("#authorText").val(z);
//        var authorsEdit = prompt("Edycja - Autorzy(Wypisz po przecinku)", z);
//        if (authorsEdit === null) {
//            return;
//        } else {
//            while (authorsEdit === '') {
//                alert("Wpisz wartosc!");
//                var authorsEdit = prompt("Edycja - Autorzy(Wpisz po przecinku)");
//            }
//        }
        /*
         * Stworzenie hidden inputa ktory przechowa ID kolumny do zmiany.
         * 
         */
        var ip = $('<input>').attr({
            type: 'hidden',
            id: 'Db_ID',
            name: 'Db_ID',
            value: Db_ID
        });
        $(ip).appendTo('body');

    });
    /*
     * Sprawdzenie czy wpisano wartosci i czy są one zgodne.        
     */
    $("#EditBook").click(function (e) {
        e.preventDefault();

        if ($("#titleText").val() === '' || $("#yearText").val() === '') {
            alert("Wpisz wszystkie wartosci!");
            return false;
        }
        if (!$.isNumeric($('#yearText').val()) || $("#yearText").val().length !== 4
                || $("#yearText").val() < 1 || Math.round($("#yearText").val()) === $("#yearText").val()) {
            alert("JS Error");
            return false;
        }
        /*
         * Przechwycenie i wpisanie do arraya elementow(autorów) z multi-selecta
         * i tych wpisanych ręcznie.
         */
        var foo = [];
        $('#my-select :selected').each(function (i, selected) {
            foo[i] = $(selected).text();
        });
        var authors_string = $("#authorText").val().trim();
        var typed_array = authors_string.split(',');
        for (var i = typed_array.length; i--; ) {
            if (typed_array[i] === '') {
                typed_array.splice(i, 1);
            }
        }
        var authors_array = typed_array.concat(foo);
        
        
        var Db_ID = $('#Db_ID').val();
        var arr2 = {
            titleText: $('#titleText').val().trim(),
            yearText: $('#yearText').val(),
            Id: Db_ID
        };
        
        /*
         * Przekazanie Ajaxem elementów do controllera książek.
         */
        jQuery.ajax({
            url: "/ajax/default/indexbooks/editbook",
            data: arr2,
            success: function (ans) {
                /*
                 * zachowanie wartości zwróconych i przekazanie
                 * Ajaxem danych do controllera autorów.
                 */
                console.log(ans);
                var book_title = ans.books.Title;
                var book_year = ans.books.Year;
                var book_id = ans.books.Id;
                var arr2 = {
                    authorText: authors_array,
                    Id: book_id
                };
                jQuery.ajax({
                    url: "/ajax/default/indexauthors/addauthor2",
                    data: arr2,
                    success: function (ans2) {
                        console.log(ans2);
                        /*
                         * Wyprintowanie w postaci html zmienionego
                         * wiersza tabeli.
                         */
                        var html2 = '<td>' +
                                '<div class="del_wrapper" align="center">\n\
                        <a href="#" class="del_button" id="del-' + book_id + '">' +
                                '<img src="styles/images/icon_del.gif" border="0" /></td><td>' +
                                '</a></div>' +
                                '<div class="del_wrapper" align="center">\n\
                        <a href="#" class="edit_button" id="del-' + book_id + '">' +
                                '<img src="styles/images/editicon.png" border="0" /></td><td>' +
                                '</a></div>' +
                                book_id + '.</td><td> ' +
                                book_title + '</td><td> ' +
                                book_year + '</td><td>' +
                                ans2.authors.Authors + '</td></tr>';
                        $("#responds #item_" + Db_ID).html(html2);
                        $("#titleText").val('');
                        $("#yearText").val('');
                        $("#authorText").val('');
                    }
                });
            }
        });
    });

});