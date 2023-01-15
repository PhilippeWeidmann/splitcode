import React from "react";

function NoCollaboratorCard() {

    return (
        <div className={"h-full p-2"}>
            <div className={"panelContent h-full bg-white rounded-md shadow-sm"}>
                <div className={"h-full grid content-center"}>
                    <div className={"flex justify-center"}>
                        <div className={"w-1/4 aspect-square"}>
                            <img src={"/void.svg"}/>
                        </div>
                    </div>
                    <div className={"text-center p-4"}>You don't have a partner yet.</div>
                </div>
            </div>
        </div>
    );
}

export default NoCollaboratorCard;
