<?php

class IndexauthorsController extends BaseController {

    public function indexAction() {
        $authors = new Model_Authors();
        $this->view->authors = $authors->getAuthors();
    }

    public function addauthorAction() {
        $authors = new Model_Authors();
        $this->_ajax->addData('authors', $authors->addAuthor($this->getParam('authorText')));
    }

    public function deleteauthorAction() {
        $authors = new Model_Authors();
        $this->_ajax->addData('authors', $authors->deleteAuthor($this->getParam('authorToDelete')));
    }

    public function editauthorAction() {
        $authors = new Model_Authors();
        $this->_ajax->addData('authors', $authors->editAuthor($this->getParam('authorText'), $this->getParam('Id')));
    }

    public function addauthor2Action() {
        $authors = new Model_Authors();
        $this->_ajax->addData('authors', $authors->addAuthor2($this->getParam('Id'), $this->getParam('authorText')));
    }

}
