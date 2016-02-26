<?php

class IndexbooksController extends BaseController {

    public function indexAction() {
        $books = new Model_Books();
        $this->view->books = $books->getBooks();
        $authors = new Model_Authors();
        $this->view->authors = $authors->getAuthors();
    }

    public function addbookAction() {
        $books = new Model_Books();
        $this->_ajax->addData('books', $books->addBook($this->getParam('titleText'), $this->getParam('yearText')));
    }

    public function deletebookAction() {
        $books = new Model_Books();
        $this->_ajax->addData('books', $books->deleteBook($this->getParam('authorToDelete')));
    }

    public function editbookAction() {
        $books = new Model_Books();
        $this->_ajax->addData('books', $books->editBook($this->getParam('Id'), $this->getParam('titleText'), $this->getParam('yearText')));
    }

}
