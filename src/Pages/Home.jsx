import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import { VerticalModal } from '../Components/VerticalModal';
import { AxiosProvider } from '../Axios/AxiosProvider';
import { BackdropModal } from '../Components/BackdropModal';
import { Product } from '../Entities/Product';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

export default function Home() {
    // Vertical Modal
    const [showModal, setShowModal] = useState(false)
    const handleVerticalModal = () => {
        setShowModal(false)
        setIsValid({ name: true, description: true, price: true })
        setCreatedProduct(false)
        setDeletedProduct(false)
    }

    //dateTime options
    const options = {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: 'numeric',
        year: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    };
    // backDropModal
    const [error, setError] = useState(false)

    //Button
    const [isLoadingButton, setLoadingButton] = useState(false);
    const handleClick = () => {
        setLoadingButton(true);
        handleCreateProduct();
        setCreatedProduct(false)
        setDeletedProduct(false)
    }

    //Form
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: 0,
        isAvailableForSale: true
    });
    const [isValid, setIsValid] = useState({
        name: true,
        description: true,
        price: true,
    })

    const formatValue = (value) => {
        let decimal = value
        decimal = decimal
            .toString()
            .replace(/\D/g, "")
            .replace(/^0+/, "")
            .padStart(3, "0")
            .replace(/^(\d{1,})(\d{2})$/, "$1,$2")
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

        if (value < 0) {
            decimal = "-" + decimal
        }

        if (value === "0") {
            value += ",";
        }
        return `R$ ${decimal}`
    }
    //ToggleButton
    const [selectedOption, setSelectedOption] = useState(1);

    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };
    //create Product

    const handleCreateProduct = async () => {
        let isValid = true;

        if (!values.name || values.name.length < 3) {
            setIsValid(prevState => ({ ...prevState, name: false }));
            isValid = false;
        }
        if (!values.description || values.description.length < 3) {
            setIsValid(prevState => ({ ...prevState, description: false }));
            isValid = false;
        }
        if (values.price == "R$ 0,00" || values.price < 0.01) {
            setIsValid(prevState => ({ ...prevState, price: false }));
            isValid = false;
        }
        if (isValid) {
            try {
                const actualDate = new Date();
                const convertedPrice = Number(values.price.replace(/\./g, "").replace(",", "").replace("R$ ", "") / 100);
                const product = new Product(actualDate.toLocaleDateString('pt-BR', options), values.name, values.description, convertedPrice, selectedOption == 1 ? true : false);

                const response = await AxiosProvider.communication("POST", "", product);
                if (response.status == 201) {
                    setShowModal(false);
                    setCreatedProduct(true);
                    setUpdateTable(updateTable + 1);
                }
            } catch (e) {
                setError(true);
            }
        }

        setLoadingButton(false)
    }

    // new product Message
    const [createdProduct, setCreatedProduct] = useState(false)

    //Table Control
    const [updateTable, setUpdateTable] = useState(0)
    const [tableData, setTableData] = useState([])
    //fetch Data
    useEffect(() => {
        async function getData() {
            try {
                const response = await AxiosProvider.communication('GET')
                if (response.data) {
                    response.data.map(i => {
                        i.price = formatValue(i.price * 100)
                    })
                }
                setTableData(response.data)
            } catch (err) {
                setError(true)
            }
        }
        getData()
    }, [updateTable])

    //Delete Product
    const [deletedProduct, setDeletedProduct] = useState(false)
    const [productDelete, setProductDelete] = useState({
        delete: false,
        key: 0,
        name: ""
    })
    const handleDelete = (i) => {
        setProductDelete({ delete: true, key: i.id, name: i.name })
        setCreatedProduct(false)
        setDeletedProduct(false)
    }
    const handleDeleteRow = async () => {
        const response = await AxiosProvider.communication("DELETE", `/${productDelete.key}`)
        setProductDelete({ delete: false, key: 0, name: "" })
        setUpdateTable(updateTable + 1)
        setDeletedProduct(true)
    }
    //Filter

    //Name
    const [nameSortOrder, setNameSortOrder] = useState(null);
    const handleNameSort = () => {
        if (nameSortOrder === null || nameSortOrder === 'desc') {
            const sortedTableData = [...tableData].sort((a, b) => a.name.localeCompare(b.name))
            setTableData(sortedTableData)
            setNameSortOrder('asc')
        } else {
            const sortedTableData = [...tableData].sort((a, b) => b.name.localeCompare(a.name))
            setTableData(sortedTableData)
            setNameSortOrder('desc')
        }
        setPriceSortOrder(null)
        setDateSortOrder(null)
    }

    //Price
    const [priceSortOrder, setPriceSortOrder] = useState(null);
    const handlePriceSort = () => {
        const sortedTableData = [...tableData].sort((a, b) => {
            const priceA = parseFloat(a.price.replace('R$ ', '').replace(',', '.'))
            const priceB = parseFloat(b.price.replace('R$ ', '').replace(',', '.'))

            if (priceSortOrder === 'asc') {
                return priceA - priceB
            } else {
                return priceB - priceA
            }
        });

        setTableData(sortedTableData);
        setNameSortOrder(null)
        setDateSortOrder(null)
        setPriceSortOrder(priceSortOrder === 'asc' ? 'desc' : 'asc')
    }

    // CreationAt
    const [dateSortOrder, setDateSortOrder] = useState(null);
    const handleDateSort = () => {
        if (dateSortOrder === null || dateSortOrder === 'desc') {
            const sortedTableData = [...tableData].sort((a, b) => new Date(a.creationAt).getTime() - new Date(b.creationAt).getTime())
            setTableData(sortedTableData)
            setDateSortOrder('asc')
        } else {
            const sortedTableData = [...tableData].sort((a, b) => new Date(b.creationAt).getTime() - new Date(a.creationAt).getTime())
            setTableData(sortedTableData)
            setDateSortOrder('desc')
        }
        setNameSortOrder(null)
        setPriceSortOrder(null)
    }

    return (
        <div>
            {error && (<BackdropModal
                title="Erro Interno"
                message="Reinicie a aplicação e tente novamente."
                namebutton="Fechar"
            />)}
            <VerticalModal
                show={showModal}
                onHide={handleVerticalModal}
                title={'Adicionar Produto'}
                namebutton={"Fechar"}
                message={(
                    <>
                        <section className='mx-5 px-5'>
                            <h4 className="text-center mt-5 my-3">Cadastrar Produto</h4>

                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" onBlur={(event) => { event.target.value == "" || event.target.value.length < 3 ? setIsValid(prevState => ({ ...prevState, name: false })) : setIsValid(prevState => ({ ...prevState, name: true })) }}
                                    onChange={(event) => setValues((prevState) => ({ ...prevState, name: event.target.value }))} value={values.name} />
                                <label htmlFor="floatingInput">Nome</label>
                            </div>
                            {!isValid.name && <p className="text-danger">Preencha o campo nome com pelo menos 3 caracteres.</p>}

                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" onBlur={(event) => { event.target.value == "" || event.target.value.length < 3 ? setIsValid(prevState => ({ ...prevState, description: false })) : setIsValid(prevState => ({ ...prevState, description: true })) }}
                                    onChange={(event) => setValues((prevState) => ({ ...prevState, description: event.target.value }))} value={values.description} />
                                <label htmlFor="floatingInput">Descrição</label>
                            </div>
                            {!isValid.description && <p className="text-danger">Preencha o campo descrição com pelo menos 3 caracteres.</p>}

                            <div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" id="floatingInput" onBlur={(event) => { event.target.value == "R$ 0,00" || event.target.value < 0.01 ? setIsValid(prevState => ({ ...prevState, price: false })) : setIsValid(prevState => ({ ...prevState, price: true })) }}
                                        onChange={event => setValues((prevState) => ({ ...prevState, price: formatValue(event.target.value) }))} value={values.price} />
                                    <label htmlFor="floatingInput">Valor</label>
                                </div>
                                {!isValid.price && <p className="text-danger px-1">Insira um valor válido.</p>}
                            </div >

                            <div>
                                <label htmlFor="radio" className='mx-2'>Disponível para venda?</label>
                                <ToggleButtonGroup type="radio" name="options" className='mx-2' defaultValue={1} value={selectedOption} onChange={handleOptionChange}>
                                    <ToggleButton id="tbg-radio-1" value={1}>
                                        Sim
                                    </ToggleButton>
                                    <ToggleButton id="tbg-radio-2" value={2}>
                                        Não
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </div>

                            <div className='text-center mt-5'>
                                <Button
                                    variant="primary"
                                    disabled={isLoadingButton}
                                    onClick={!isLoadingButton ? handleClick : null}
                                >
                                    {isLoadingButton ? 'Carregando...' : 'Cadastrar'}
                                </Button>
                            </div>
                        </section>
                    </>)} />
            <div className='text-center my-5'>
                <button className='btn btn-success' onClick={() => {
                    setShowModal(true)
                    setValues({ name: "", description: "", price: 0.00 })
                }}>Cadastrar novo produto</button>
            </div>

            <VerticalModal
                show={productDelete.delete}
                onHide={() => {
                    setProductDelete(prevState => ({ ...prevState, delete: false, key: 0, name: "" }))
                    setDeletedProduct(false)
                    setCreatedProduct(false)
                }}
                title={"Deletar Produto"}
                anotherbutton={+true}
                classanotherbutton={"btn table-modal-btn btn-danger"}
                clickanotherbutton={() => handleDeleteRow()}
                anotherbuttonmessage={"Deletar"}
                namebutton={"Cancelar"}
                message={
                    <>
                        <p>Tem certeza que deseja deletar o produto "{productDelete.name}"?</p>
                    </>
                }
            />


            <div>
                {createdProduct && <p className='text-center text-success'>Produto cadastrado com sucesso!</p>}
                {deletedProduct && <p className='text-center text-danger'>Produto deletado com sucesso!</p>}
                {tableData.length != 0 ? (<div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th><button onClick={handleDateSort} className='btn fw-bold'>Data de Criação {dateSortOrder === 'asc' ? '↓' : dateSortOrder === 'desc' ? '↑' : ''}</button></th>
                                <th><button onClick={handleNameSort} className='btn fw-bold'>Nome{nameSortOrder === 'asc' ? '↓' : nameSortOrder === 'desc' ? '↑' : ''}</button></th>
                                <th className='pb-3'>Descrição</th>
                                <th><button onClick={() => handlePriceSort()} className='btn fw-bold'>Preço{priceSortOrder === 'asc' ? '↓' : priceSortOrder === 'desc' ? '↑' : ''}</button></th>
                                <th className='pb-3'>Disponível para Venda</th>
                                <th className='pb-3'>Opções</th>
                            </tr>
                        </thead>


                        {tableData.map((info) => (
                            <tbody key={info.id}>
                                <tr>
                                    <td>{info.creationAt}</td>
                                    <td>{info.name}</td>
                                    <td>{info.description}</td>
                                    <td>{info.price}</td>
                                    <td className='text-center'>{info.isAvailableForSale ? "Sim" : "Não"}</td>
                                    <td className="text-center"><button onClick={() => handleDelete(info)} type="button" className="btn ms-1 p-1 btn-danger">Deletar</button></td>
                                </tr>
                            </tbody>

                        ))}

                    </Table>
                </div>
                ) : (
                    <div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th><button onClick={handleDateSort} className='btn fw-bold'>Data de Criação {dateSortOrder === 'asc' ? '↓' : dateSortOrder === 'desc' ? '↑' : ''}</button></th>
                                    <th><button onClick={handleNameSort} className='btn fw-bold'>Nome{nameSortOrder === 'asc' ? '↓' : nameSortOrder === 'desc' ? '↑' : ''}</button></th>
                                    <th className='pb-3'>Descrição</th>
                                    <th><button onClick={() => handlePriceSort()} className='btn fw-bold'>Preço{priceSortOrder === 'asc' ? '↓' : priceSortOrder === 'desc' ? '↑' : ''}</button></th>
                                    <th className='pb-3'>Disponível para Venda</th>
                                    <th className='pb-3'>Opções</th>
                                </tr>
                            </thead>
                        </Table>
                        <p className='text-center mt-3'>Nenhum produto cadastrado.</p>
                    </div>)}



            </div>
        </div>
    )
}
