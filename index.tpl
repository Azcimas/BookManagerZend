<!-- Index of books -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script src="http://code.jquery.com/ui/1.9.2/jquery-ui.js"></script>
<script src="/scripts/jquery.multi-select.js"></script>
<script type="text/javascript" src="/scripts/books.js"></script>

<h1> LIST OF BOOKS </h1>
<table id="responds">
    <tr>
        <th>Delete</th>
        <th>Edit</th>
        <th>Id</th>
        <th>Title</th>
        <th>Year</th>
        <th>Authors</th>

    </tr>

    {foreach from=$books item=book} 
        <tr id="item_{$book.id}">

            <td><div class="del_wrapper" align="center">
                    <a href="#" class="del_button" id="del-{$book.id}">
                        <img src="styles/images/icon_del.gif" border="0" /></a></div></td>
            <td><div class="del_wrapper" align="center">
                    <a href="#" class="edit_button" id="del-{$book.id}">
                        <img src="styles/images/editicon.png" border="0" /></a></div></td>
            <td>{$book.id}</td>
            <td>{$book.title}</td>
            <td>{$book.year}</td>
            <td>{$book.con_list}</td>
        </tr>
    {/foreach}

</table><br>
<p id="addbook">ADD BOOK:</p><br>
<textarea name="title_txt" id="titleText" cols="35" rows="1" placeholder="Insert Book's Title"></textarea><br>
<textarea name="year_txt" id="yearText" cols="35" rows="1" placeholder="Insert Book's Year of Publish"></textarea><br>
New Authors(adding):<br>
<textarea name="authors_txt" id="authorText" cols="35" rows="1" placeholder="Insert Authors(new)"></textarea><br>
<br>
<p>Add Existing Authors:</p>
<select multiple="multiple" id="my-select" name="my-select[]">
    {foreach from=$authors item=author}
        <option value="elem_{$author.id}">{$author.name}</option>
    {/foreach}
</select><br>



<button id="SubmitBook">Add Book</button>
<button id="EditBook">Edit Book</button>
