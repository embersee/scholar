import RegList from "./RegList";
import Container from "@/components/ui/container";
import Heading from "@/components/ui/heading";

async function Registation() {
    return (
        <Container className="flex flex-col mt-2 items-center">
            <Heading
                title="First steps"
                description="You need to fill some data"
            />
            <RegList />
        </Container>
    );
};

export default Registation;