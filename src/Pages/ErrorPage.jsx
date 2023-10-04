import { Link } from "react-router-dom"
import "../Styles/index.css"
function ErrorPage() {
    return (
        <div className="container">
            <div className="text-center mt-5">
                <h1>Erro 404</h1>
                <h4>Página não encontrada.</h4>
                <Link to="/" className='navbar-site fw-medium'><button className="btn btn-info">voltar para Home</button></Link>
            </div>
        </div>
    )
}

export default ErrorPage