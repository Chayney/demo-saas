import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardTemplate } from "./DashboardTemplate";


const { mockLogoutUser, mockDeleteCustomer, mockRefresh } = vi.hoisted(
    () => ({
        mockLogoutUser: vi.fn(),
        mockDeleteCustomer: vi.fn(),
        mockRefresh: vi.fn(),
    }),
);

vi.mock("@/actions/auth", () => ({
    logoutUser: mockLogoutUser,
}));

vi.mock("@/actions/customer", () => ({
    deleteCustomer: mockDeleteCustomer,
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        refresh: mockRefresh,
    }),
}));

const customers = [
    {
        id: 1,
        name: "山田太郎",
        email: "yamada@example.com",
        phone: "090-1234-5678",
        address: "東京都渋谷区",
        createdAt: new Date("2026-10-01"),
    },
    {
        id: 2,
        name: "佐藤花子",
        email: "sato@example.com",
        phone: "080-9876-5432",
        address: "大阪府大阪市",
        createdAt: new Date("2026-10-02"),
    },
];

const defaultProps = {
    customerCount: 10,
    projectCount: 5,
    recentCustomers: customers,
};

const renderDashboard = () =>
    render(<DashboardTemplate {...defaultProps} />);

describe("DashboardTemplate", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockDeleteCustomer.mockResolvedValue(undefined);
    });

    describe("表示", () => {
        it("ダッシュボードのタイトルと説明を表示する", () => {
            renderDashboard();

            expect(
                screen.getByRole("heading", {
                    name: "ダッシュボード",
                }),
            ).toBeInTheDocument();

            expect(
                screen.getByText(
                    "顧客情報や案件の状況を確認できます。",
                ),
            ).toBeInTheDocument();
        });

        it("顧客数と案件数を表示する", () => {
            renderDashboard();

            expect(screen.getByText("10")).toBeInTheDocument();
            expect(screen.getByText("5")).toBeInTheDocument();

            expect(
                screen.getByRole("link", {
                    name: /顧客一覧を見る/,
                }),
            ).toHaveAttribute("href", "/customers");

            expect(
                screen.getByRole("link", {
                    name: /案件一覧を見る/,
                }),
            ).toHaveAttribute("href", "/projects");
        });

        it("顧客情報をカードに表示する", () => {
            renderDashboard();

            expect(
                screen.getByRole("heading", {
                    name: "山田太郎",
                }),
            ).toBeInTheDocument();

            expect(
                screen.getByText("yamada@example.com"),
            ).toBeInTheDocument();

            expect(
                screen.getByText("090-1234-5678"),
            ).toBeInTheDocument();

            expect(
                screen.getByText("東京都渋谷区"),
            ).toBeInTheDocument();

            expect(
                screen.getByRole("heading", {
                    name: "佐藤花子",
                }),
            ).toBeInTheDocument();
        });

        it("ログアウトボタンを表示する", () => {
            renderDashboard();

            const logoutButton = screen.getByRole("button", {
                name: "ログアウト",
            });

            expect(logoutButton).toBeInTheDocument();
            expect(logoutButton.closest("form")).toHaveAttribute(
                "action",
            );
        });

        it("顧客登録リンクを表示する", () => {
            renderDashboard();

            expect(
                screen.getByRole("link", {
                    name: /顧客を登録/,
                }),
            ).toHaveAttribute("href", "/customers/create");
        });

        it("顧客の詳細リンクと編集リンクを表示する", () => {
            renderDashboard();

            expect(
                screen.getByRole("link", {
                    name: "山田太郎の詳細",
                }),
            ).toHaveAttribute("href", "/customers/1");

            expect(
                screen.getByRole("link", {
                    name: "山田太郎を編集",
                }),
            ).toHaveAttribute("href", "/customers/edit/1");
        });
    });

    describe("顧客検索", () => {
        it("顧客名で検索できる", async () => {
            const user = userEvent.setup();

            renderDashboard();

            await user.type(
                screen.getByRole("searchbox", {
                    name: "顧客を検索",
                }),
                "山田",
            );

            expect(
                screen.getByRole("heading", {
                    name: "山田太郎",
                }),
            ).toBeInTheDocument();

            expect(
                screen.queryByRole("heading", {
                    name: "佐藤花子",
                }),
            ).not.toBeInTheDocument();
        });

        it("メールアドレスで検索できる", async () => {
            const user = userEvent.setup();

            renderDashboard();

            await user.type(
                screen.getByRole("searchbox"),
                "SATO@EXAMPLE.COM",
            );

            expect(
                screen.getByRole("heading", {
                    name: "佐藤花子",
                }),
            ).toBeInTheDocument();

            expect(
                screen.queryByRole("heading", {
                    name: "山田太郎",
                }),
            ).not.toBeInTheDocument();
        });

        it("検索結果がない場合は空状態を表示する", async () => {
            const user = userEvent.setup();

            renderDashboard();

            await user.type(
                screen.getByRole("searchbox"),
                "存在しない顧客",
            );

            expect(
                screen.getByText("該当する顧客がいません。"),
            ).toBeInTheDocument();

            expect(
                screen.queryByRole("heading", {
                    name: "山田太郎",
                }),
            ).not.toBeInTheDocument();
        });

        it("検索文字列を消すと顧客一覧が再表示される", async () => {
            const user = userEvent.setup();

            renderDashboard();

            const searchInput = screen.getByRole("searchbox");

            await user.type(searchInput, "山田");

            expect(
                screen.queryByRole("heading", {
                    name: "佐藤花子",
                }),
            ).not.toBeInTheDocument();

            await user.clear(searchInput);

            expect(
                screen.getByRole("heading", {
                    name: "山田太郎",
                }),
            ).toBeInTheDocument();

            expect(
                screen.getByRole("heading", {
                    name: "佐藤花子",
                }),
            ).toBeInTheDocument();
        });
    });

    describe("顧客削除", () => {
        it("削除前に確認ダイアログを表示する", async () => {
            const user = userEvent.setup();

            const confirmSpy = vi
                .spyOn(window, "confirm")
                .mockReturnValue(false);

            renderDashboard();

            await user.click(
                screen.getByRole("button", {
                    name: "山田太郎を削除",
                }),
            );

            expect(confirmSpy).toHaveBeenCalledWith(
                "この顧客を削除しますか？",
            );

            confirmSpy.mockRestore();
        });

        it("削除をキャンセルすると削除処理を実行しない", async () => {
            const user = userEvent.setup();

            vi.spyOn(window, "confirm").mockReturnValue(false);

            renderDashboard();

            await user.click(
                screen.getByRole("button", {
                    name: "山田太郎を削除",
                }),
            );

            expect(mockDeleteCustomer).not.toHaveBeenCalled();
            expect(mockRefresh).not.toHaveBeenCalled();

            vi.restoreAllMocks();
        });

        it("削除成功時に顧客IDを渡し、画面を更新する", async () => {
            const user = userEvent.setup();

            vi.spyOn(window, "confirm").mockReturnValue(true);

            renderDashboard();

            await user.click(
                screen.getByRole("button", {
                    name: "山田太郎を削除",
                }),
            );

            await waitFor(() => {
                expect(mockDeleteCustomer).toHaveBeenCalledWith(1);
                expect(mockRefresh).toHaveBeenCalledTimes(1);
            });

            vi.restoreAllMocks();
        });

        it("削除に失敗するとエラーメッセージを表示する", async () => {
            const user = userEvent.setup();

            vi.spyOn(window, "confirm").mockReturnValue(true);

            const alertSpy = vi
                .spyOn(window, "alert")
                .mockImplementation(() => { });

            mockDeleteCustomer.mockRejectedValueOnce(
                new Error("削除に失敗しました"),
            );

            renderDashboard();

            await user.click(
                screen.getByRole("button", {
                    name: "山田太郎を削除",
                }),
            );

            await waitFor(() => {
                expect(alertSpy).toHaveBeenCalledWith(
                    "顧客の削除に失敗しました。",
                );
            });

            expect(mockRefresh).not.toHaveBeenCalled();

            vi.restoreAllMocks();
        });
    });
});