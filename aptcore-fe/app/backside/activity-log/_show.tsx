import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ActivityLog as ThisType } from "@/app/_types/activity-log"
import LoadingSection from "@/components/element/loading-section"
import { ShowDialogProps } from "@/app/_types/form-props"
import { DateTime } from "luxon"

export default function ShowThisData({
  open,
  moduleTitle,
  loading = false,
  onClose,
  showData
}: ShowDialogProps<ThisType>) {
  const payload = showData?.payload ?? null
  const hasPayload = payload && typeof payload === "object" && Object.keys(payload).length > 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">Detail {moduleTitle}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <LoadingSection />
        ) : (
          <>
            <div className="flow-root my-5 py-3 border rounded">
              <dl className="-my-3 divide-y divide-gray-200 dark:divide-gray-700 text-sm *:even:bg-gray-50 dark:*:even:bg-gray-800/40">
                {[
                  { label: "Info", value: showData?.note },
                  {
                    label: "User",
                    value: showData?.user
                      ? `${showData.user.fullName} (@${showData.user.username})`
                      : "-"
                  },
                  {
                    label: "User from website",
                    value: showData?.website
                      ? `${showData.website.title} (${showData.website.domain})`
                      : "-"
                  },
                  { label: "Module", value: showData?.module },
                  { label: "Action", value: showData?.action },
                  { label: "Status", value: showData?.status },
                  { label: "IP Address", value: showData?.ipAddress },
                  { label: "User Agent", value: showData?.userAgent },
                  {
                    label: "Created At",
                    value: showData?.createdAt
                      ? DateTime.fromISO(showData.createdAt).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
                      : "-"
                  }
                ].map(({ label, value }) => (
                  <div key={label} className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900 dark:text-gray-100">{label}</dt>
                    <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2 break-all">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Payload table */}
            {hasPayload && (
              <div className="my-6">
                <h3 className="text-base font-semibold mb-2">Payload</h3>
                <div className="overflow-x-auto border rounded">
                  <table className="w-full text-sm text-left table-auto">
                    <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
                      <tr>
                        <th className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100 w-1/3">Key</th>
                        <th className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(payload).map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-200 dark:border-gray-700">
                          <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">{key}</td>
                          <td className="px-4 py-2 text-gray-800 dark:text-gray-200 break-words">
                            {typeof value === "string" && value.trim().startsWith("<") ? (
                              <div
                                className="prose prose-sm dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: value }}
                              />
                            ) : typeof value === "object" ? (
                              <pre className="whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
                            ) : (
                              String(value)
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
