import { useMemo, useState, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Download,
  Edit3,
  FileArchive,
  FileSpreadsheet,
  FileText,
  History,
  LayoutDashboard,
  ListChecks,
  ScanLine,
  Search,
  UploadCloud,
  UserRound,
} from 'lucide-react';

type Page = 'dashboard' | 'upload' | 'verify' | 'records' | 'audit';
type Confidence = 'high' | 'medium' | 'low';
type RecordStatus = 'pending' | 'confirmed' | 'exception';

type NavigationItem = {
  id: Page;
  label: string;
  icon: LucideIcon;
};

type DocumentRecord = {
  id: string;
  fileName: string;
  customer: string;
  category: string;
  amount: string;
  status: RecordStatus;
  confidence: Confidence;
  owner: string;
  handledAt: string;
};

type VerificationField = {
  key: string;
  label: string;
  value: string;
  confidence: Confidence;
};

type AuditLog = {
  id: string;
  documentId: string;
  actor: string;
  action: string;
  field: string;
  detail: string;
  time: string;
  tone: 'neutral' | 'success' | 'warning';
};

const navigation: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload', label: '单据上传', icon: UploadCloud },
  { id: 'verify', label: '人工校验', icon: ClipboardCheck },
  { id: 'records', label: '记录列表', icon: ListChecks },
  { id: 'audit', label: '审计日志', icon: History },
];

const records: DocumentRecord[] = [
  {
    id: 'YD-20260702-018',
    fileName: '华东仓_入库单_0702.pdf',
    customer: '上海明衡贸易',
    category: '镀锌卷',
    amount: '¥84,750.00',
    status: 'pending',
    confidence: 'medium',
    owner: '待分配',
    handledAt: '09:48',
  },
  {
    id: 'YD-20260702-017',
    fileName: '客户签收单_晨星材料.jpg',
    customer: '晨星材料',
    category: '铝型材',
    amount: '¥32,180.00',
    status: 'confirmed',
    confidence: 'high',
    owner: '周岚',
    handledAt: '09:31',
  },
  {
    id: 'YD-20260702-016',
    fileName: '过磅单_江北堆场.png',
    customer: '江北堆场',
    category: '螺纹钢',
    amount: '¥19,520.00',
    status: 'exception',
    confidence: 'low',
    owner: '李牧',
    handledAt: '09:12',
  },
  {
    id: 'YD-20260702-015',
    fileName: '订单确认函_远泰.pdf',
    customer: '远泰供应链',
    category: '冷轧板',
    amount: '¥67,900.00',
    status: 'confirmed',
    confidence: 'high',
    owner: '陈越',
    handledAt: '08:56',
  },
  {
    id: 'YD-20260702-014',
    fileName: '发货明细_南桥厂区.pdf',
    customer: '南桥厂区',
    category: '线材',
    amount: '¥43,260.00',
    status: 'pending',
    confidence: 'medium',
    owner: '待分配',
    handledAt: '08:34',
  },
];

const initialFields: VerificationField[] = [
  { key: 'date', label: '日期', value: '2026-07-02', confidence: 'high' },
  { key: 'customer', label: '客户', value: '上海明衡贸易有限公司', confidence: 'high' },
  { key: 'category', label: '品类', value: '镀锌卷', confidence: 'medium' },
  { key: 'weight', label: '重量', value: '18.5 吨', confidence: 'medium' },
  { key: 'unitPrice', label: '单价', value: '4,580 元/吨', confidence: 'high' },
  { key: 'total', label: '总价', value: '84,730 元', confidence: 'low' },
  { key: 'batchNo', label: '批次号', value: 'MHB-0702-A17', confidence: 'medium' },
  { key: 'remark', label: '备注', value: '票面总价与系统估算差 20 元，需人工确认。', confidence: 'low' },
];

const auditLogs: AuditLog[] = [
  {
    id: 'log-01',
    documentId: 'YD-20260702-018',
    actor: '王澈',
    action: '上传',
    field: '文件',
    detail: '上传 华东仓_入库单_0702.pdf',
    time: '2026-07-02 09:46',
    tone: 'neutral',
  },
  {
    id: 'log-02',
    documentId: 'YD-20260702-018',
    actor: 'AI 识别助手',
    action: '识别',
    field: '结构化字段',
    detail: '生成 8 个字段，2 个低置信度字段进入人工校验',
    time: '2026-07-02 09:47',
    tone: 'warning',
  },
  {
    id: 'log-03',
    documentId: 'YD-20260702-016',
    actor: '李牧',
    action: '修改',
    field: '重量',
    detail: '从 4.2 吨修正为 4.7 吨',
    time: '2026-07-02 09:17',
    tone: 'warning',
  },
  {
    id: 'log-04',
    documentId: 'YD-20260702-017',
    actor: '周岚',
    action: '确认',
    field: '整单',
    detail: '字段核对完成，状态更新为已确认',
    time: '2026-07-02 09:35',
    tone: 'success',
  },
];

const confidenceLabel: Record<Confidence, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

const statusLabel: Record<RecordStatus, string> = {
  pending: '待校验',
  confirmed: '已确认',
  exception: '有异常',
};

function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [recognitionStarted, setRecognitionStarted] = useState(false);
  const [fields, setFields] = useState<VerificationField[]>(initialFields);
  const [recordFilter, setRecordFilter] = useState<RecordStatus | 'all'>('pending');
  const [notice, setNotice] = useState('');

  const currentPage = navigation.find((item) => item.id === activePage) ?? navigation[0];

  const updateField = (key: string, value: string) => {
    setFields((items) =>
      items.map((item) => (item.key === key ? { ...item, value } : item)),
    );
  };

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2200);
  };

  return (
    <div className="min-h-screen bg-bg text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-surface px-4 py-5 lg:block">
        <BrandBlock />
        <nav className="mt-7 space-y-1" aria-label="主导航">
          {navigation.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              active={activePage === item.id}
              onClick={() => setActivePage(item.id)}
            />
          ))}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-line bg-bg p-3">
          <p className="text-sm font-semibold text-ink">Demo 模式</p>
          <p className="mt-1 text-xs leading-5 text-muted">
            本地 mock data 演示，不连接 OCR、LLM 或数据库。
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-line bg-bg/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted">传统行业单据录入自动化</p>
              <h1 className="truncate text-xl font-semibold text-ink">{currentPage.label}</h1>
            </div>
            <div className="hidden items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-muted sm:flex">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              2026-07-02 10:12
            </div>
          </div>
          <nav
            className="flex gap-2 overflow-x-auto border-t border-line px-4 py-2 lg:hidden"
            aria-label="移动端导航"
          >
            {navigation.map((item) => (
              <button
                key={item.id}
                className={`focus-ring inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                  activePage === item.id
                    ? 'bg-primary text-white'
                    : 'bg-surface text-muted hover:text-ink'
                }`}
                onClick={() => setActivePage(item.id)}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {activePage === 'dashboard' && <Dashboard onOpenRecords={() => setActivePage('records')} />}
          {activePage === 'upload' && (
            <UploadPage
              fileName={uploadedFileName}
              recognitionStarted={recognitionStarted}
              onFileSelected={(fileName) => {
                setUploadedFileName(fileName);
                setRecognitionStarted(false);
              }}
              onStart={() => setRecognitionStarted(true)}
              onOpenVerify={() => setActivePage('verify')}
            />
          )}
          {activePage === 'verify' && (
            <VerifyPage fields={fields} onFieldChange={updateField} onNotice={showNotice} />
          )}
          {activePage === 'records' && (
            <RecordsPage
              filter={recordFilter}
              onFilterChange={setRecordFilter}
              onExport={() => showNotice('导出 Excel 仅为前端按钮演示，未生成真实文件。')}
            />
          )}
          {activePage === 'audit' && <AuditPage />}
        </main>
      </div>

      {notice && (
        <div
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-ink px-4 py-3 text-sm font-medium text-white"
          role="status"
        >
          {notice}
        </div>
      )}
    </div>
  );
}

function BrandBlock() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
        <ScanLine className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="font-semibold text-ink">AI 录单台</p>
        <p className="text-xs text-muted">MVP Frontend Demo</p>
      </div>
    </div>
  );
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: NavigationItem;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`focus-ring flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition ${
        active
          ? 'bg-primary text-white'
          : 'text-muted hover:bg-panel hover:text-ink'
      }`}
      onClick={onClick}
    >
      <item.icon className="h-4 w-4" aria-hidden="true" />
      {item.label}
    </button>
  );
}

function Dashboard({ onOpenRecords }: { onOpenRecords: () => void }) {
  const stats = [
    {
      label: '今日处理单据数',
      value: '128',
      caption: '较昨日 +18 单',
      icon: FileText,
    },
    {
      label: '待人工校验数量',
      value: '14',
      caption: '低置信度 5 单',
      icon: ClipboardCheck,
    },
    {
      label: '识别成功率',
      value: '96.8%',
      caption: 'mock 统计口径',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3" aria-label="今日概览">
        {stats.map((item) => (
          <article key={item.label} className="rounded-lg border border-line bg-surface p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-normal text-ink">{item.value}</p>
              </div>
              <div className="rounded-md bg-primary-soft p-2 text-primary-strong">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-4 text-sm text-muted">{item.caption}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-lg border border-line bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-ink">最近处理记录</h2>
              <p className="mt-1 text-sm text-muted">展示系统刚完成识别或校验的单据。</p>
            </div>
            <button
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-line bg-bg px-3 py-2 text-sm font-medium text-ink hover:bg-panel"
              onClick={onOpenRecords}
            >
              查看全部
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <ResponsiveTable>
            <thead>
              <tr className="text-left text-xs font-semibold text-muted">
                <th className="px-5 py-3">单据编号</th>
                <th className="px-5 py-3">客户</th>
                <th className="px-5 py-3">金额</th>
                <th className="px-5 py-3">状态</th>
                <th className="px-5 py-3">处理时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-sm">
              {records.slice(0, 4).map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4 font-medium text-ink">{item.id}</td>
                  <td className="px-5 py-4 text-muted">{item.customer}</td>
                  <td className="px-5 py-4 text-ink">{item.amount}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-5 py-4 text-muted">{item.handledAt}</td>
                </tr>
              ))}
            </tbody>
          </ResponsiveTable>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5">
          <h2 className="text-base font-semibold text-ink">人工介入原因</h2>
          <div className="mt-4 space-y-4">
            <QueueReason label="金额疑似不一致" count={5} color="danger" />
            <QueueReason label="票面污损或遮挡" count={4} color="warning" />
            <QueueReason label="客户名称需归一" count={3} color="accent" />
            <QueueReason label="批次号缺失" count={2} color="primary" />
          </div>
        </div>
      </section>
    </div>
  );
}

function QueueReason({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: 'danger' | 'warning' | 'accent' | 'primary';
}) {
  const barColor = {
    danger: 'bg-danger',
    warning: 'bg-warning',
    accent: 'bg-accent',
    primary: 'bg-primary',
  }[color];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-muted">{count} 单</span>
      </div>
      <div className="h-2 rounded-full bg-panel">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${Math.max(18, count * 13)}%` }}
        />
      </div>
    </div>
  );
}

function UploadPage({
  fileName,
  recognitionStarted,
  onFileSelected,
  onStart,
  onOpenVerify,
}: {
  fileName: string;
  recognitionStarted: boolean;
  onFileSelected: (fileName: string) => void;
  onStart: () => void;
  onOpenVerify: () => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <section className="rounded-lg border border-line bg-surface p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary-soft p-2 text-primary-strong">
            <UploadCloud className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-ink">上传图片 / PDF</h2>
            <p className="mt-1 text-sm text-muted">选择本地文件后，可触发一组假识别结果。</p>
          </div>
        </div>

        <label
          htmlFor="document-upload"
          className="mt-6 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line bg-bg px-6 py-8 text-center transition hover:bg-panel"
        >
          <FileArchive className="h-10 w-10 text-primary" aria-hidden="true" />
          <span className="mt-4 text-base font-semibold text-ink">点击选择单据文件</span>
          <span className="mt-2 max-w-md text-sm leading-6 text-muted">
            支持常见图片与 PDF 的界面演示；文件只保存在浏览器当前状态中，不会上传到任何服务。
          </span>
          <input
            id="document-upload"
            className="sr-only"
            type="file"
            accept="image/*,.pdf,application/pdf"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) onFileSelected(file.name);
            }}
          />
        </label>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-bg p-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted">当前文件</p>
            <p className="mt-1 truncate font-semibold text-ink">
              {fileName || '尚未选择文件'}
            </p>
          </div>
          <button
            className="focus-ring inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:bg-line disabled:text-muted"
            disabled={!fileName}
            onClick={onStart}
          >
            <ScanLine className="h-4 w-4" aria-hidden="true" />
            开始识别
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-ink">假识别结果</h2>
        {!recognitionStarted ? (
          <div className="mt-5 flex min-h-72 flex-col items-center justify-center rounded-lg bg-bg px-6 text-center">
            <Search className="h-9 w-9 text-muted" aria-hidden="true" />
            <p className="mt-4 font-semibold text-ink">等待识别</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
              选择文件并点击开始识别后，这里会展示 mock 结构化结果。
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="rounded-lg bg-accent-soft p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-ink">识别完成，建议进入人工校验</p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    8 个字段已生成，其中 2 个低置信度字段需要确认。
                  </p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-line rounded-lg border border-line">
              {initialFields.slice(0, 5).map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted">{item.label}</p>
                    <p className="mt-1 truncate font-semibold text-ink">{item.value}</p>
                  </div>
                  <ConfidenceBadge level={item.confidence} />
                </div>
              ))}
            </div>
            <button
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong"
              onClick={onOpenVerify}
            >
              进入人工校验
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function VerifyPage({
  fields,
  onFieldChange,
  onNotice,
}: {
  fields: VerificationField[];
  onFieldChange: (key: string, value: string) => void;
  onNotice: (message: string) => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
      <section className="rounded-lg border border-line bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-ink">单据预览占位</h2>
            <p className="mt-1 text-sm text-muted">当前 Demo 不渲染真实图片或 PDF 内容。</p>
          </div>
          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-strong">
            预览区域
          </span>
        </div>
        <div className="document-paper mt-5 aspect-[0.72] max-h-[720px] rounded-lg border border-line bg-bg p-6">
          <div className="mx-auto h-full max-w-md rounded-md border border-line bg-white p-6">
            <div className="mb-8 h-8 w-36 rounded bg-primary-soft" />
            <div className="space-y-3">
              {Array.from({ length: 11 }).map((_, index) => (
                <div
                  key={index}
                  className="h-3 rounded bg-panel"
                  style={{ width: `${index % 3 === 0 ? 92 : index % 3 === 1 ? 76 : 58}%` }}
                />
              ))}
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-9 rounded border border-line bg-surface" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-ink">结构化字段校验</h2>
            <p className="mt-1 text-sm text-muted">每个字段均可编辑，低置信度字段优先核对。</p>
          </div>
          <button
            className="focus-ring inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong"
            onClick={() => onNotice('Demo 已模拟确认，本地数据不会写入数据库。')}
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            确认校验
          </button>
        </div>

        <form className="grid gap-4 p-5 md:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
          {fields.map((field) => (
            <label key={field.key} className="block">
              <span className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-ink">{field.label}</span>
                <ConfidenceBadge level={field.confidence} />
              </span>
              {field.key === 'remark' ? (
                <textarea
                  className="focus-ring min-h-28 w-full resize-y rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink"
                  value={field.value}
                  onChange={(event) => onFieldChange(field.key, event.target.value)}
                />
              ) : (
                <input
                  className="focus-ring w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink"
                  value={field.value}
                  onChange={(event) => onFieldChange(field.key, event.target.value)}
                />
              )}
            </label>
          ))}
        </form>
      </section>
    </div>
  );
}

function RecordsPage({
  filter,
  onFilterChange,
  onExport,
}: {
  filter: RecordStatus | 'all';
  onFilterChange: (filter: RecordStatus | 'all') => void;
  onExport: () => void;
}) {
  const filteredRecords = useMemo(
    () => (filter === 'all' ? records : records.filter((record) => record.status === filter)),
    [filter],
  );

  const filterOptions: Array<RecordStatus | 'all'> = ['all', 'pending', 'confirmed', 'exception'];

  return (
    <section className="rounded-lg border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-ink">已处理单据</h2>
          <p className="mt-1 text-sm text-muted">状态筛选和导出按钮均为前端 UI 演示。</p>
        </div>
        <button
          className="focus-ring inline-flex items-center gap-2 rounded-md border border-line bg-bg px-4 py-2.5 text-sm font-semibold text-ink hover:bg-panel"
          onClick={onExport}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          导出 Excel
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-line px-5 py-4">
        {filterOptions.map((option) => (
          <button
            key={option}
            className={`focus-ring rounded-md px-3 py-2 text-sm font-medium transition ${
              filter === option
                ? 'bg-primary text-white'
                : 'bg-bg text-muted hover:bg-panel hover:text-ink'
            }`}
            onClick={() => onFilterChange(option)}
          >
            {option === 'all' ? '全部' : statusLabel[option]}
          </button>
        ))}
      </div>

      <ResponsiveTable>
        <thead>
          <tr className="text-left text-xs font-semibold text-muted">
            <th className="px-5 py-3">单据编号</th>
            <th className="px-5 py-3">文件名</th>
            <th className="px-5 py-3">客户</th>
            <th className="px-5 py-3">品类</th>
            <th className="px-5 py-3">状态</th>
            <th className="px-5 py-3">置信度</th>
            <th className="px-5 py-3">处理人</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line text-sm">
          {filteredRecords.map((item) => (
            <tr key={item.id}>
              <td className="px-5 py-4 font-medium text-ink">{item.id}</td>
              <td className="max-w-[220px] truncate px-5 py-4 text-muted">{item.fileName}</td>
              <td className="px-5 py-4 text-ink">{item.customer}</td>
              <td className="px-5 py-4 text-muted">{item.category}</td>
              <td className="px-5 py-4">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-5 py-4">
                <ConfidenceBadge level={item.confidence} />
              </td>
              <td className="px-5 py-4 text-muted">{item.owner}</td>
            </tr>
          ))}
        </tbody>
      </ResponsiveTable>
    </section>
  );
}

function AuditPage() {
  return (
    <section className="rounded-lg border border-line bg-surface">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-base font-semibold text-ink">审计日志</h2>
        <p className="mt-1 text-sm text-muted">
          展示上传、识别、修改、确认等 mock 事件，便于说明可追溯链路。
        </p>
      </div>
      <div className="divide-y divide-line">
        {auditLogs.map((item) => (
          <article key={item.id} className="flex gap-4 px-5 py-4">
            <div className="mt-1">
              <AuditIcon tone={item.tone} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-ink">{item.action}</p>
                <span className="text-sm text-muted">·</span>
                <p className="text-sm text-muted">{item.documentId}</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-ink">{item.detail}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.actor}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.field}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.time}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AuditIcon({ tone }: { tone: AuditLog['tone'] }) {
  const className = {
    neutral: 'bg-accent-soft text-accent',
    success: 'bg-primary-soft text-primary-strong',
    warning: 'bg-panel text-danger',
  }[tone];

  const Icon = tone === 'success' ? CheckCircle2 : tone === 'warning' ? AlertTriangle : History;

  return (
    <div className={`flex h-9 w-9 items-center justify-center rounded-md ${className}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
    </div>
  );
}

function ResponsiveTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0">{children}</table>
    </div>
  );
}

function ConfidenceBadge({ level }: { level: Confidence }) {
  const className = {
    high: 'bg-primary-soft text-primary-strong',
    medium: 'bg-accent-soft text-accent',
    low: 'bg-danger text-white',
  }[level];

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      置信度 {confidenceLabel[level]}
    </span>
  );
}

function StatusBadge({ status }: { status: RecordStatus }) {
  const className = {
    pending: 'bg-accent-soft text-accent',
    confirmed: 'bg-primary-soft text-primary-strong',
    exception: 'bg-danger text-white',
  }[status];

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      {statusLabel[status]}
    </span>
  );
}

export default App;
