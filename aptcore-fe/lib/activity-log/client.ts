import { toast } from "sonner"

export type ActivityAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'DELETE_PERMANENT' | 'RESTORE' | string

export interface ActivityLogOptions {
  payload?: Record<string, unknown> | null
  status?: string
  website_id?: string | null
  user_id?: string | null
  postFix?: string | null
}

/**
 * Fungsi client-side untuk mencatat log aktivitas
 */

export function msgLog(module: string, action: string, success: boolean, title?: string | null) {
  const formattedModule = module.replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, c => c.toUpperCase());

  const formattedAction = action.replace(/_/g, ' ').toLowerCase();

  if (success) {
    return `${formattedModule} ${formattedAction} successfully${title ? ` : ${title}` : ''}`;
  } else {
    return `Failed to ${formattedAction} ${formattedModule.toLowerCase()}${title ? ` : ${title}` : ''}`;
  }
}


type LogInfo = {
    success : boolean,
    module : string,
    action : string,
    msg : string | null,
    title: string | null,
    payload?: Record<string, unknown> | null,
    payloadFailed?: Record<string, unknown> | null,
}

export async function toastAndLog(LogInfo : LogInfo){
  let msg = msgLog(LogInfo.module, LogInfo.msg ?? LogInfo.action, true, LogInfo.title)

  if (LogInfo.success) {
      toast.success(msg);
      await Activitylog(LogInfo.module, LogInfo.msg ?? LogInfo.action, msg, {
          payload: LogInfo?.payload
      })
  } else {
      msg = msgLog(LogInfo.module, LogInfo.action, false)
      toast.error(msg);
      await Activitylog(LogInfo.module, LogInfo.action, msg, {
          payload: LogInfo.payloadFailed,
          status: 'FAILED'
      })
  }
}


export async function Activitylog(
  module: string,
  action: ActivityAction,
  note?: string,
  options: ActivityLogOptions = {}
) {
  const body = {
    module,
    action,
    note,
    payload: options.payload || null,
    status: options.status || 'SUCCESS',
    website_id: options.website_id || null,
    user_id: options.user_id || null,
    postFix: options.postFix || '',
  }

  try {
    await fetch('/api/activity-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } catch (err) {
    console.error('Failed to send activity log:', err)
  }
}
