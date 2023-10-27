/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

import { Workspace } from "@/nextspace/types";
import { createContext } from "react";


const WorkspaceHolder = createContext({} as any as Workspace);
WorkspaceHolder.displayName = "WorkspaceContext"

export default WorkspaceHolder