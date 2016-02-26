<?php

class Model_Books extends Model_Base_Db {

    protected $_books;

    public function __construct() {
        parent::__construct();

        $this->_books = new Zend_Db_Table('books');
    }
    /* 
     * Wczytanie do controllera id,tytulu i roku ksiazki oraz autorow ktorzy
     * poprzez concat dopisani sa do napisanych przez nich ksiazek. 
     * Concat mozliwy jest dzieki dodatkowej bazie laczacej ksiazki z autorami.
     * 
     * @return array
     */
    public function getBooks() {
        /* @var $select Zend_Db_Select */
        $select = $this->_db->select();
        $select
                ->from('books', array('id', 'title', 'year'))
                ->join(array('j' => 'books_to_authors'), 'j.book_id = books.id', array())
                ->join('authors', 'authors.id = j.author_id', array('con_list' => new Zend_Db_Expr('GROUP_CONCAT(DISTINCT authors.name ORDER BY authors.name)')))
                ->group('books.id')
                ->order('books.id');

        $book = $this->_db->fetchAll($select);
        return $book;
    }
    /*
     * Dodawanie ksiazki
     * 
     * @param string $titleTexy, int $yeatText
     * @return array
     */
    public function addBook($titleText, $yearText) {
        /*
         * Sprawdzenie czy wartosci zostaly wpisane i czy sa poprawne.
         */
        if (isset($titleText) && isset($yearText)) {
            /*
             * Jesli nie: wyrzuci error
             */
            if (!is_numeric($yearText) || strlen($yearText) != 4 || (int) $yearText < 1000 || $yearText != round($yearText)) {
                $output = array(
                    "Error" => "PHP error"
                );
            /*
             * Jesli tak: stworzy wiersz z nowa ksiazka i zapisze sobie jej ID.
             */
                
            } else {

                $row = $this->_books->createRow();
                $row->title = $titleText;
                $row->year = $yearText;
                $insert_id = $row->save();
                $output = array(
                    "Id" => $insert_id,
                    "Title" => $titleText,
                    "Year" => $yearText
                );
            }
        }
        return $output;
    }
    /*
     * Edycja ksiazki
     * 
     * @param int $id, string $titleText, int $yearText
     * @return array
     */
    public function editBook($id, $titleText, $yearText) {
        $data = array(
            'title' => $titleText,
            'year' => $yearText,
        );
        /*
         * Oprocz zmiany w roku i tytule ksiazki usuniete zostana wszystkie
         * polaczenia autorow z ta ksiazka(te ktore sa prawidlowe zostana dodane
         * w funkcji addAuthors2 klasy Authors.
         */
        $this->_db->update('books', $data, array('id = ?' => (int) $id));
        $this->_db->delete('books_to_authors', array('book_id = ?' => (int) $id));
        $output = array(
            "Id" => $id,
            "Title" => $titleText,
            "Year" => $yearText
        );
        return $output;
    }

    public function deleteBook($id) {
        $this->_db->delete('books', array('id = ?' => (int) $id));
        $this->_db->delete('books_to_authors', array('book_id = ?' => (int) $id));
    }

}
