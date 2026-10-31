
import CreateUrlForm from "../components/CreateUrlForm";

function CreateUrl() {

    return (
        <div className="management-page">

            <div className="page-heading">

                <div>
                    <h1>Create Short URL</h1>

                    <p>
                        Convert long URLs into short, shareable links.
                    </p>
                </div>

            </div>

            <CreateUrlForm />

        </div>
    );
}

export default CreateUrl;
