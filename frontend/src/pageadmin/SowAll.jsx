import { useEffect, useState } from "react";
import Siderbar from "./Siderbar";
import { Link } from "react-router-dom";
import Config from "../Config";
import Pagination from "../components/Pagination";

const SowAll = () => {
    const [sow, setSow] = useState([]); // Inicializa como array vacío
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
    const [allSows, setAllSows] = useState([]); // Todos los datos

    useEffect(() => {
        const fetchSows = async (page) => {
            try {
                const response = await Config.getSowAll(page);
                console.log("API Response:", response); // Verificar la respuesta completa

                if (response && response.data) {
                    if (Array.isArray(response.data)) {
                        setSow(response.data); // Los datos de los sows están en response.data
                        setTotalPages(response.last_page);
                    } else if (Array.isArray(response.data.data)) {
                        setSow(response.data.data); // Los datos de los sows están en response.data.data
                        setTotalPages(response.data.last_page);
                    } else {
                        console.error("Data is not an array:", response.data.data);
                    }
                } else {
                    console.error("La respuesta no es válida:", response);
                }
            } catch (error) {
                console.error("Error al obtener datos:", error);
            } finally {
                setLoading(false); // Marcar que la carga ha terminado
            }
        };
        fetchSows(currentPage);
    }, [currentPage]);

    useEffect(() => {
        const fetchAllSows = async () => {
            try {
                let allData = [];
                let page = 1;
                let lastPage = 1;

                do {
                    const response = await Config.getSowAll(page);
                    if (response && response.data) {
                        if (Array.isArray(response.data)) {
                            allData = allData.concat(response.data);
                            lastPage = response.last_page;
                        } else if (Array.isArray(response.data.data)) {
                            allData = allData.concat(response.data.data);
                            lastPage = response.data.last_page;
                        } else {
                            console.error("Data is not an array:", response.data.data);
                            break;
                        }
                    } else {
                        console.error("La respuesta no es válida:", response);
                        break;
                    }
                    page++;
                } while (page <= lastPage);

                setAllSows(allData);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };
        fetchAllSows();
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setLoading(true); // Volver a poner loading en true al cambiar de página
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredSows = allSows.filter((item) =>
        item.ticket_sow.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sow_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.project_id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.delivery_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ticket_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sow_status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const dataToDisplay = searchTerm ? filteredSows : sow;

    return (
        <div className="container-fluid">
            <div className="row">
                <Siderbar />
                <div className="col-sm-11 mt-4 mb-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex">
                            <div className="col-sm-2 me-5">
                                <Link
                                    to={"/admin/sow/create"}
                                    className="btn btn-primary d-flex justify-content-center"
                                >
                                    <span className="material-symbols-outlined">
                                        add_circle
                                    </span>
                                    New Sow
                                </Link>
                            </div>
                            <div className="col-sm-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            </div>
                            <div className="table-responsive mt-3">
                                <table className="table table-hover table-bordered table-striped">
                                    <thead>
                                        <tr className="table-secondary">
                                            <th className="col-sm-2">Sow-Ticket</th>
                                            <th className="col-sm-4">Description</th>
                                            <th className="col-sm-2">Project</th>
                                            <th className="col-sm-1">Team</th>
                                            <th className="col-sm-2">Date</th>
                                            <th className="col-sm-2">Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="7">Loading...</td>
                                            </tr>
                                        ) : dataToDisplay.length > 0 ? ( // Usar datos a mostrar
                                            dataToDisplay.map((item) => (
                                                <tr key={item.ticket_sow}>
                                                    <td>{item.ticket_sow}</td>
                                                    <td>{item.sow_description}</td>
                                                    <td>{item.project_id}</td>
                                                    <td>{item.delivery_team}</td>
                                                    <td>{item.ticket_date}</td>
                                                    <td>{item.sow_status}</td>
                                                    <td>
                                                        <Link
                                                            to={`/admin/sow/details/${item.ticket_sow}`}
                                                            className="btn d-flex justify-content-center w-50"
                                                            style={{ backgroundColor: "#F9E2AF" }}>
                                                            <span className="material-symbols-outlined">
                                                                pageview
                                                            </span>

                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7">Sows not found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {!searchTerm && (
                                <div>
                                    <Pagination
                                        totalPages={totalPages}
                                        currentPage={currentPage}
                                        handlePageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SowAll;
