/*
 * @file-created: 2023-10-26
 * @author: Dennis Chen
 */
import { ProgressIndicator } from '@/nextspace/types'

import spin from '@/nextspace/assets/spin.svg'


const INDICATOR_CLASS_NAME = 'nextspace-spi'


export default class SimpleProgressIndicator implements ProgressIndicator {

    private container?: HTMLElement

    private delay: number

    private count = 0;

    private indicator?: HTMLElement

    constructor({ container, delay }: { container?: HTMLElement, delay?: number } = {}) {
        this.container = container || typeof document === 'undefined' ? undefined : document.body
        this.delay = delay || 500
    }

    start = () => {
        const { container, delay } = this
        this.count++

        if (this.count > 1) {
            return
        }

        if (!container) {
            console.log("Progress started at ", new Date())
        } else if (!this.indicator) {
            const indicator = this.indicator = document.createElement("div")
            indicator.className = INDICATOR_CLASS_NAME
            if (delay > 0) {
                indicator.className += ' hide'
                setTimeout(() => {
                    //still showing
                    if (this.indicator) {
                        this.indicator.className = INDICATOR_CLASS_NAME
                    }
                }, delay)
            }

            indicator.innerHTML = `<img src="${spin.src}" width="32px" height="32px"/>`

            container.appendChild(indicator)
        }


    }
    end = (force?: boolean) => {
        const { container } = this
        this.count--

        if (!force && this.count > 0) {
            return
        }
        if (force) {
            this.count = 0
        }

        if (!container) {
            console.log("Progress ended at ", new Date())
        } else if (this.indicator) {
            container.removeChild(this.indicator)
            this.indicator = undefined
        }
    }
}