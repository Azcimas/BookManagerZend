$(document).ready(function () {
    $("#EditAuthor").hide();
    /*
     * Dodanie autorów.
     */
    $("#SubmitAuthor").click(function (e) {
        e.preventDefault();
        /*
         * Sprawdzenie czy wartość została wpisana.
         */
        if ($("#authorText").val() === '') {
            alert("Wpisz wartosc!");
            return false;
        }
        /*
         * Pozbycie się białych znaków.
         * @type String 
         */
        var new_author = $("#authorText").val().trim();


        var arr2 = {
            authorText: new_author
        };
        /*
         * Przekazanie danych do controllera autorów.
         */
        jQuery.ajax({
            url: "/ajax/default/indexauthors/addauthor",
            data: arr2,
            success: function (ans) {
                /*
                 * Sprawdzenie czy pojawił się erro PHP, tj. autor jest już w bazie.
                 */
                if (ans.authors.Error === 0) {
                    alert('Ten autor znajduje się już w bazie');
                } else {
                    /*
                     * Wypisanie wiersza w tabeli z nowym autorem.
                     */
                    var html = '<tr id="item_' + ans["Id"] + '"><td>' +
                            '<div class="del_wrapper" align="center">\n\
                        <a href="#" class="del_button" id="del-' + ans["Id"] + '">' +
                            '<img src="styles/images/icon_del.gif" border="0" /></td><td>' +
                            '</a></div>' +
                            '<div class="del_wrapper" align="center">\n\
                        <a href="#" class="edit_button" id="del-' + ans["Id"] + '">' +
                            '<img src="styles/images/editicon.png" border="0" /></a></div>' +
                            '</td><td>' +
                            ans.authors.Id + '</td><td>' +
                            ans.authors.Name + '</td></tr>';

                    $("#authors").append(html);
                    $("#authorText").val('');
                }
            }

        });

    });

    /*
     * Usunięcie autora.
     */
    $("body").on("click", "#authors .del_button", function (e) {
        e.preventDefault();
        /*
         * Walidacja, czy użytkownik chce na pewno usunąć.
         */
        if (confirm('Czy na pewno chcesz usunąć pozycję?')) {
            var clickedID = this.id.split('-');
            var Db_ID = clickedID[1];
            var arr = {
                authorToDelete: Db_ID
            };


            /*
             * Przekazanie danych do controllera autorów.
             */
            jQuery.ajax({
                url: "/ajax/default/indexauthors/deleteauthor",
                data: arr,
                success: function (ans) {
                    console.log(ans);
                    /*
                     * Sprawdznie czy autor nie jest przypisany do książek w bazie.
                     * Jeśli tak to usunięcie jest niemożliwe. W innym wypadku usunie
                     * html dane autora.
                     */
                    if (ans.authors.Error === 0) {
                        alert('Niemozliwe jest usuniecie tego autora');
                    } else {
                        $('#item_' + Db_ID).fadeOut();

                    }
                }
            });
        }
    });


    /*
     * Edycja autora.
     */
    $("body").on("click", "#authors .edit_button", function (e) {
        $("#Db_ID").remove();
        e.preventDefault();
        $("#edit_author").html('Edycja Autora:');
        $("#SubmitAuthor").hide();
        $("#EditAuthor").show();
        var clickedID = this.id.split('-');
        var Db_ID = clickedID[1];
        var q = $('tr#item_' + Db_ID + ' td:nth-child(4)').html();
        $("#authorText").val(q);
        /*
         * Stworzenie pola hidden by przechowac wartosc ID do edycji.
         */
        var ip = $('<input>').attr({
            type: 'hidden',
            id: 'Db_ID',
            name: 'Db_ID',
            value: Db_ID
        });
        $(ip).appendTo('body');
//      var nameEdit = prompt("Edycja - Nazwa Autora", q);
//        if (nameEdit === null) {
//            return;
//        } else {
//            while (nameEdit === '') {
//                alert("Wpisz wartosc!");
//                var nameEdit = prompt("Edycja - Nazwa Autora");
//            }
//        }
    });

    $("#EditAuthor").click(function () {
        var Db_ID = $('#Db_ID').val();
        var arr = {
            authorText: $("#authorText").val(),
            Id: $('#Db_ID').val()
        };
        
        /*
         * Przekazanie danych do controllera autorów.
         */
        jQuery.ajax({
            url: "/ajax/default/indexauthors/editauthor",
            data: arr,
            success: function (ans) {
                console.log(ans);
                /*
                 * Sprawdznie czy autor istnieje w bazie.
                 * Jeśli tak to edycja jest niemożliwe. W innym wypadku zmieni
                 * stary htmlowy wiersz na nowy wraz z danymi autora.
                 */
                if (ans.authors.Error === 0) {
                    alert('Ten autor znajduje się już w bazie');
                } else {
                    var html = '<td>' +
                            '<div class="del_wrapper" align="center">\n\
                        <a href="#" class="del_button" id="del-' + Db_ID + '">' +
                            '<img src="styles/images/icon_del.gif" border="0" /></td><td>' +
                            '</a></div>' +
                            '<div class="styles/images/del_wrapper" align="center">\n\
                        <a href="#" class="edit_button" id="del-' + Db_ID + '">' +
                            '<img src="styles/images/editicon.png" border="0" /></a></div>' +
                            '</td><td>' +
                            Db_ID + '</td><td>' +
                            ans.authors.Name + '</td>';

                    $("#authors #item_" + Db_ID).html(html);
                }

            }
        });
    });
});




