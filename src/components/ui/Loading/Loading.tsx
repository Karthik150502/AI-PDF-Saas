import React from 'react'
import "./styles.css"
export default function Loading({ status }: { status?: string }) {
    return (
        <div className="flex flex-col item-center justify-center">
            <div className="loading-anim-con">
                <div className="lds-roller">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            {
                status && <div className="progress-status">
                    <p className="text-base font-extrabold">{status}</p>
                </div>
            }

        </div>
    )
}
