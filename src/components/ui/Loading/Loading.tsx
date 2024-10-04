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
                    <p className="text-xs font-bold">{status}</p>
                </div>
            }

        </div>
    )
}
