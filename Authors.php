<?php

class Model_Authors extends Model_Base_Db {

    protected $_authors;
    protected $_books_to_authors;

    public function __construct() {
        parent::__construct();

        $this->_authors = new Zend_Db_Table('authors');
        $this->_books_to_authors = new Zend_Db_Table('books_to_authors');
    }

    /**
     * Pobiera autorów i przekazuje do kontrolera.
     * 
     * @return array
     */
    public function getAuthors() {
        $select = $this->_db->select();
        $select->from('authors', array('id', 'name'));

        $authors = $this->_db->fetchAll($select);
        return $authors;
    }

    /**
     * Dodaje autorów do bazy.
     * 
     * @param string $authorText
     * @return array
     */
    public function addAuthor($authorText) {
        $select = $this->_db->select();
        $select->from('authors', array('id'));
        $select->where('name = ?', $authorText);
        $same = $this->_db->fetchOne($select);
        /*
         * Sprawdznie czy autor znajduje sie w bazie, jesli tak, to wyrzuca error.
         */
        if ($same) {
            $output = array(
                "Error" => 0
            );
            /*
             * W innym przypadku tworzy nowy wiersz z autorem.
             */
        } else {
            $row = $this->_authors->createRow();
            $row->name = $authorText;
            $insert_id = $row->save();
            /*
             * Output do controllera to Id i Nazwa nowego autora
             */
            $output = array(
                "Error" => 1,
                "Id" => $insert_id,
                "Name" => $authorText
            );
        }

        return $output;
    }

    /*
     * Edycja autora
     * 
     * @param string $authorText, in $id
     * @return array
     */

    public function editAuthor($authorText, $id) {
        $author_name = trim($authorText);

        $select = $this->_db->select();
        $select->from('authors', array('id'));
        $select->where('name = ?', $author_name);
        $same = $this->_db->fetchOne($select);
        /*
         * Sprawdznie czy autor znajduje sie w bazie, jesli tak, to wyrzuca error.
         */
        if ($same) {
            $output = array(
                "Error" => 0
            );
        /*
         * W innym przypadku tworzy nowy wiersz z autorem.
         */
        } else {
            $data = array(
                "name" => $author_name
            );

            $this->_db->update('authors', $data, array('id = ?' => (int) $id));
            /*
             * Output do controllera to Nazwa nowego autora
             */
            $output = array(
                "Error" => 1,
                "Name" => $author_name
            );
        }

        return $output;
    }
    /*
     * Usuniecie autora
     * 
     * @param int $authorToDelete
     * @return array
     */
    public function deleteAuthor($authorToDelete) {
        $select = $this->_db->select();
        $select->from('books_to_authors', array('book_id'));
        $select->where('author_id = ?', $authorToDelete);
        $authors_id = $this->_db->fetchOne($select);
        /*
         * Sprawdznie czy autor napisal ktoras z ksiazek w bazie,
         * jesli tak to wyrzuca error.
         */
        if ($authors_id) {
            $output = array(
                "Error" => 0
            );
        /*
         * W innym przypadku usuwa autora z bazy.
         */
        } else {
            $this->_db->delete('authors', array('id = ?' => (int) $authorToDelete));
            $output = array(
                "Error" => 1
            );
        }

        return $output;
    }
    /*
     * Dodanie autora w przypadku edycji lub dodawnia nowej ksiazek, ktore dodatkowo
     * wpisuje wartosci book_id i author_id do bazy laczacej ksiazki z autorami.
     * 
     * @param int $id, array $authorText
     * @return array
     */
    public function addAuthor2($id, $authorText) {
        /*
         * Iteracja przez podanych autorow w celu sprawdzenia czy znajduja sie juz w bazie.
         * Jesli tak: wez jego id.
         * Jesli nie: stworz takiego autora i wez jego id.
         */
        foreach ($authorText as $item) {
            $select = $this->_db->select();
            $select->from('authors', array('id'));
            $select->where('name = ?', $item);
            $same = $this->_db->fetchOne($select);

            if ($same) {
                $author_inserted_id = $same;
            } else {
                $row = $this->_authors->createRow();
                $row->name = $item;
                $author_inserted_id = $row->save();
            }
            /*
             * Dodaje id ksiazki i id nowego/istniejacego autora do bazy
             * laczacej ksiazke z autorem (books_to_authors).
             */
            $row2 = $this->_books_to_authors->createRow();
            $row2->book_id = $id;
            $row2->author_id = $author_inserted_id;
            $row2->save();
        }

        $output = array(
            "Authors" => $authorText
        );

        return $output;
    }

}
