import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'

let modules = import.meta.glob("../views/**/index.vue")

export const useStore = defineStore('myStore', {
    state: () => {
        return {
            // 路由表
            routes: [] as Array<RouteRecordRaw>
        }
    },
    getters: {},
    actions: {
        addRoutes(data: Array<any>, router: any) {
            return new Promise((resolve) => {
                const traverse = (array: Array<any>) => {
                    return array.map((item: any) => {
                        const { children } = item
                        if (children && children.length) {
                            item.children = traverse(children)
                        }
                        item.component = item.component ? modules[`../views/${item.component}/index.vue`] : null
                        return item
                    })
                }
                this.routes = traverse(data)
                this.routes.forEach(m => router.addRoute(m))
                resolve(true)
            })
        },
    }
})
