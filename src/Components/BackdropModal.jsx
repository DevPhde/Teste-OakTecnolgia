import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import "../Styles/modal.css"

export function BackdropModal(props) {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.message}
        </Modal.Body>
        <Modal.Footer>
        <Link className='btn btn-info' onClick={handleClose} to={props.to}>
          {props.namebutton}
          </Link>
        </Modal.Footer>
      </Modal>
    </>
  );
}