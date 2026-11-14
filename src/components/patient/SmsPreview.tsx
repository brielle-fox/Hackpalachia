/** Phone-style text bubble. Shows that reminders work on any phone without internet. */
export default function SmsPreview({ message }: { message: string }) {
  return (
    <figure className="w-full max-w-sm">
      <div className="rounded-[28px] bg-stone-900 p-4">
        <div className="mb-3 flex justify-between px-1 text-xs text-stone-400">
          <span>Messages</span>
          <span>10:02</span>
        </div>
        <div className="flex flex-col gap-2 rounded-[18px] bg-stone-100 p-3.5">
          <p className="text-xs text-stone-400">Text message</p>
          <p className="rounded-2xl rounded-bl-sm bg-white p-3 text-sm">{message}</p>
          <p className="self-end rounded-2xl rounded-br-sm bg-brand px-3.5 py-2 text-sm font-medium text-white">C</p>
        </div>
      </div>
      <figcaption className="mt-2 text-xs text-stone-600">Text reminders work on any phone, no internet needed.</figcaption>
    </figure>
  );
}
